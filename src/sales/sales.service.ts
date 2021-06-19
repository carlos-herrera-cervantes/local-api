import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CollectMoney } from '../collects/schemas/collect.schema';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CollectMoneyService } from '../collects/collects.service';
import { StationsService } from '../stations/stations.service';
import { IMongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Tax } from '../taxes/schemas/tax.schema';
import { BaseService } from '../base/base.service';

import '../base/extensions/array.extension';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SalesService extends BaseService {

  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private collectsService: CollectMoneyService,
    private stationsService: StationsService
  ) {
    super(saleModel);
  }

  /**
   * Creates the structure of ticket to send a Cloud API
   * @param {String} id Sale ID
   * @returns Object
   */
  async createCloudStructure(id: string): Promise<any> {
    const filter = {
      relation: [
        'products->product.taxes.measurementUnit',
        'customer',
        'paymentTransaction.paymentMethod'
      ]
    } as IMongoDBFilter;

    const sale = await super.getByIdAsync(id, filter) as any;

    return {
      _id: sale?._id?.toString(),
      folio: sale?.folio,
      vat: sale?.vat,
      subtotal: sale?.subtotal,
      total: sale?.total,
      totalLetters: sale?.totalLetters,
      userId: sale?.user?.toString(),
      station: sale?.station?.toString(),
      products: sale?.products?.map((product: any) => {
        return {
          _id: product?.product?._id?.toString(),
          name: product?.product?.name,
          description: product?.product?.description,
          quantity: product?.quantity,
          priceUnit: product?.product?.pricePublic,
          price: product?.product?.pricePublic * product?.quantity,
          measurementUnit: product?.product?.measurementUnit?.short,
          measurementUnitSat: product?.product?.measurementUnit?.keySat,
          taxes: product?.product?.taxes?.map((tax: any) => {
            return {
              percentage: tax?.percentage,
              name: tax?.name,
              _id: tax?._id?.toString()
            }
          }),
        }
      }),
      payments: sale?.paymentTransaction?.map((payment: any) => {
        return {
          quantity: payment?.quantity,
          key: payment?.paymentMethod?.key,
          description: payment?.paymentMethod?.description,
          _id: payment?.paymentMethod?._id?.toString()
        }
      }),
      client: {
        email: sale?.customer?.email,
        _id: sale?.customer?._id?.toString()
      }
    };
  }

  /**
   * Initialize a sale object
   * @param {String} clientId Client ID
   * @param {String} positionId Position ID
   * @param {String} userId User ID
   * @returns Sale object
   */
  async initializeSaleObject(customerId: string, positionId: string, userId: string): Promise<any> {
    const filter = { sort: '-consecutive', page: 0, pageSize: 1 } as IMongoDBFilter;
    const [lastSale, station] = await Promise.all([
      super.getAllAsync(filter),
      this.stationsService.getOneAsync()
    ]);

    return {
      customer: customerId,
      position: positionId,
      user: userId,
      folio: 'RE' + new Date().getTime(),
      consecutive: !lastSale?.length ? 1 : lastSale[0]?.consecutive + 1,
      station: station?._id
    };
  }

  /**
   * Calculate the total of sale
   * @param {Sale} sale Sale instance
   * @returns Sale instance
   */
  async calculateTotalAsync(sale: Sale): Promise<Sale> {
    const productIds = sale?.products?.map((product: any) => product.product);
    const filter = {
      criteria: {
        _id: { $in: productIds }
      },
      relation: ['taxes']
    } as IMongoDBFilter;
    const products = await this.productsService.getAllAsync(filter);
    const merged = products.merge(sale.products, '_id', 'product');

    const [total, subtotal, vat] = [
      this.getTotalOfSale(merged),
      this.getSubtotalOfSale(merged),
      this.getVatOfSale(merged)
    ];
    const totalLetters = this.numberToLetter(total).trim();

    return Object.assign(sale, { total, subtotal, vat, totalLetters });
  }

  /**
   * Adds the amount paid by the customer to the user
   * @param {String} userId 
   * @param {Sale} sale
   * @returns Void
   */
  async chargeMoneyToUser(userId: string, sale: any): Promise<User> {
    const user = await this.usersService.getByIdAsync(userId);

    for (const payment of sale.payments) {
      if (payment?.key == '01') {
        user.cashMoneyAmount += payment.quantity;
        await this.usersService.saveAsync(user);
        return user;
      }

      user.cardMoneyAmount += payment.quantity;
      await this.usersService.saveAsync(user);
    }

    return user;
  }

  /**
   * Returns the report for the cut turn
   * @param {Object} intervals Object with start and end intervals of turn
   * @param {String} userId User ID
   * @return Object with total products saled, payments and collects
   */
  async doReportAsync(intervals: any, userId: string): Promise<any> {
    const { start, end } = intervals;
    const filterBase = { createdAt: { $gte: start, $lte: end }, user: userId };
    const filterSale = {
      criteria: { status: '201', ...filterBase },
      relation: [
        'products->product',
        'paymentTransaction.paymentMethod'
      ]
    } as IMongoDBFilter

    const [sales, collects] = await Promise.all([
      super.getAllAsync(filterSale),
      this.collectsService.getAllAsync({ criteria: filterBase } as IMongoDBFilter)
    ]);

    return {
      products: this.countProducts(sales),
      payments: this.countPayments(sales),
      collectsCash: collects.filter((collect: CollectMoney) => collect?.type == 'cash'),
      collectsCards: collects.filter((collect: CollectMoney) => collect?.type == 'card')
    };
  }

  /**
   * Converts number to letters
   * @param {number} number Quantity
   * @param {object} currency Default currency
   * @returns The total in letters
   */
  private numberToLetter(number: number, currency: any = {}): string {
    const data = {
      number,
      integers: Math.floor(number),
      pennies: Math.round(number * 100) - Math.floor(number) * 100,
      letterPennies: '',
      letterCoinPlural: currency.plural || 'PESOS',
      letterCoinSingular: currency.singular || 'PESO',
      letterCoinPenniesPlural: currency.centPlural || 'CENTAVOS',
      letterCoinPenniesSingular: currency.centSingular || 'CENTAVO',
    };

    if (data.pennies > 0) {
      data.letterPennies = 'CON ' + (data.pennies == 1) ?
        this.getMillions(data.pennies) + ' ' + data.letterCoinPenniesSingular :
        this.getMillions(data.pennies) + ' ' + data.letterCoinPenniesPlural;
    }

    if (data.integers == 0) return 'CERO ' + data.letterCoinPlural + ' ' + data.letterPennies;

    return data.integers == 1 ?
      this.getMillions(data.integers) + ' ' + data.letterCoinSingular + ' ' + data.letterPennies :
      this.getMillions(data.integers) + ' ' + data.letterCoinPlural + ' ' + data.letterPennies;
  }

  /**
   * Gets chain of units
   * @param {number} number Quantity
   * @returns Chain of unit
   */
  private getUnits(number: number): string | undefined {
    switch (number) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE'
    }
  }

  /**
   * Concatenates tens
   * @param {string} label First label
   * @param {number} numberUnits Unit quantity
   * @returns String concatenated
   */
  private getTensConcatenate(label: string, numberUnits: number): string {
    return numberUnits > 0 ?
      label + ' Y ' + this.getUnits(numberUnits) :
      label;
  }

  /**
   * Gets chain of tens
   * @param {number} number Quantity
   * @returns Chain of tens
   */
  private getTens(number: number): string | undefined {
    const ten = Math.floor(number / 10);
    const unit = number - ten * 10;

    switch (ten) {
      case 1:
        switch (unit) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + this.getUnits(unit);
        }
      case 2:
        switch (unit) {
          case 0: return 'VEINTE';
          default: return 'VEINTI' + this.getUnits(unit);
        }
      case 3: return this.getTensConcatenate('TREINTA', unit);
      case 4: return this.getTensConcatenate('CUARENTA', unit);
      case 5: return this.getTensConcatenate('CINCUENTA', unit);
      case 6: return this.getTensConcatenate('SESENTA', unit);
      case 7: return this.getTensConcatenate('SETENTA', unit);
      case 8: return this.getTensConcatenate('OCHENTA', unit);
      case 9: return this.getTensConcatenate('NOVENTA', unit);
      case 0: return this.getUnits(unit);
    }
  }

  /**
   * Gets chain of hundres
   * @param {number} number Quantity
   * @returns Chain of hundreds
   */
  private getHundreds(number: number): string | undefined {
    const hundreds = Math.floor(number / 100);
    const tens = number - hundreds * 100;

    switch (hundreds) {
      case 1:
        if (tens > 0) return 'CIENTO ' + this.getTens(tens);
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + this.getTens(tens);
      case 3: return 'TRESCIENTOS ' + this.getTens(tens);
      case 4: return 'CUATROCIENTOS ' + this.getTens(tens);
      case 5: return 'QUINIENTOS ' + this.getTens(tens);
      case 6: return 'SEISCIENTOS ' + this.getTens(tens);
      case 7: return 'SETECIENTOS ' + this.getTens(tens);
      case 8: return 'OCHOCIENTOS ' + this.getTens(tens);
      case 9: return 'NOVECIENTOS ' + this.getTens(tens);
    }

    return this.getTens(tens);
  }

  /**
   * Gets section of letters from quantity
   * @param {number} number 
   * @param {number} divider 
   * @param {number} singular Quantity in singular
   * @param {number} plural Quantity in plural
   * @returns Number in letters
   */
  private getSection(number: number, divider: number, singular: string, plural: string): string {
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;
    let letters = '';

    if (hundreds > 0) {
      letters = hundreds > 1 ? this.getHundreds(hundreds) + ' ' + plural : singular;
    }

    if (residue > 0) letters += '';

    return letters;
  }

  /**
   * Gets chain of thousands
   * @param {number} number Quantity
   * @returns Chain of thousands
   */
  private getThousands(number: number): string | undefined {
    const divider = 1000
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;
    const stringThousands = this.getSection(number, divider, 'UN MIL', 'MIL')
    const stringHundreds = this.getHundreds(residue);

    if (stringThousands == '') return stringHundreds;

    return stringThousands + ' ' + stringHundreds;
  }

  /**
   * Gets chain of millions
   * @param {number} number Quantity
   * @returns Chain of thousands
   */
  private getMillions(number: number): string | undefined {
    const divider = 1000000;
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;

    const stringMillions = this.getSection(number, divider, 'UN MILLON DE', 'MILLONES DE');
    const stringThousands = this.getThousands(residue);

    if (stringMillions == '') return stringThousands;

    return stringMillions + ' ' + stringThousands;
  }

  /**
   * Count the products and take the categories
   * @param {Array} sales List of sales
   * @returns List of categories
   */
  private countProducts(sales: any[]): any[] {
    if (!sales.length) return [];

    const products = [];

    for (const sale of sales) {
      const flat = sale?.products;
      products.push(...flat);
    }

    const categories: any = [];

    for (const product of products) {
      const [label, amount] = [
        product?.product?.name,
        product?.product?.pricePublic
      ];
      const existsCategory = categories.find((category: any) => category?.label == label);

      if (existsCategory) {
        const index = categories.findIndex((category: any) => category?.label == label);
        categories[index].amount += amount;
      }
      else {
        categories.push({ label, amount });
      }
    }

    return categories;
  }

  /**
   * Count the sales and take the payments
   * @param {Array} sales List of sales
   * @returns List of payments
   */
  private countPayments(sales: any[]): any[] {
    if (!sales.length) return [];

    const payments: any = [];

    for (const sale of sales) {
      const flat = sale?.paymentTransaction;
      payments.push(...flat);
    }

    const categories: any = [];

    for (const payment of payments) {
      const [label, amount] = [
        payment?.paymentMethod?.name,
        payment?.quantity
      ];
      const existsCategory = categories.find((payment: any) => payment?.label == label);

      if (existsCategory) {
        const index = categories.findIndex((payment: any) => payment?.label == label);
        categories[index].amount += amount;
      }
      else {
        categories.push({ label, amount });
      }
    }

    return categories;
  }

  /**
   * Gets the total of products
   * @param {Array} products List of products
   * @returns Total of products
   */
  private getTotalOfSale(products: any[]): number {
    return products.reduce((accumulator: number, product: any) =>
      accumulator + product?.quantity * product?.pricePublic, 0);
  }

  /**
   * Gets the subtotal of products
   * @param {Array} products List of products
   * @returns Subtotal of products
   */
  private getSubtotalOfSale(products: any[]): number {
    return products.reduce((accumulator: number, product: any) => {
      const priceWithoutIva = product?.type == 'fuel' ?
      Math.floor(this.getPriceWithoutIeps(product)) :
      Math.floor(this.getPriceWithoutVat(product));

      return accumulator + priceWithoutIva;
    }
    , 0);
  }

  /**
   * Gets the vat of products
   * @param {Array} products List of products
   * @returns Vat of products
   */
  private getVatOfSale(products: any[]): number {
    return products
      .reduce((accumulator: number, product: any) => {
        const priceWithoutIva = product?.type == 'fuel' ?
        Math.floor(this.getPriceWithoutIeps(product)) :
        Math.floor(this.getPriceWithoutVat(product));
        
        return accumulator + (product?.pricePublic * product?.quantity) - priceWithoutIva;
      }
      , 0);
  }

  /**
   * Gets the price of fuel without vat
   * @param {Product} product Product instance
   * @returns Price without vat
   */
  private getPriceWithoutIeps(product: any): number {
    const [liters, IEPS, IVA] = [
      product?.quantity,
      product?.taxes?.find((tax: Tax) => tax?.name == 'IEPS') as Tax,
      product?.taxes?.find((tax: Tax) => tax?.name == 'IVA') as Tax
    ];
    const iepsPerLiter = IEPS?.percentage * liters;
    const unitCost = (product?.pricePublic - IEPS?.percentage) / (IVA?.percentage + 1) + IEPS?.percentage;

    const subtotal = unitCost * liters;
    const base = subtotal - iepsPerLiter;
    const ivaOnCost = base * IVA?.percentage;

    return product?.pricePublic - ivaOnCost;
  }

  /**
   * Gets the price of product without vat
   * @param {Product} product Product instance
   * @returns Price without vat
   */
  private getPriceWithoutVat(product: any): number {
    const productQuantity = product?.quantity;
    const vat = product?.taxes.find((tax: Tax) => tax?.name == 'IVA');
    const tax = vat?.percentage * productQuantity;
    const pricePublic = product?.pricePublic;

    return tax == 0 ?
      (pricePublic * productQuantity) / (1.16 * productQuantity) :
      (pricePublic * productQuantity) / (tax + 1);
  }

}