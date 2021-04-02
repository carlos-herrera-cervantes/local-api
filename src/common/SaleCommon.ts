import * as R from 'ramda';
import { Service } from '@tsed/common';
import { SaleService } from '../services/SaleService';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { CollectMoneyService } from '../services/CollectService';
import { Sale } from '../models/Sale';
import { Product } from '../models/Product';
import { CollectMoney } from '../models/CollectMoney';
import { Tax } from '../models/Tax';
import { IProductProjection } from '../models/IProductProjection';
import { ISaleProjection } from '../models/ISaleProjection';
import { StationService } from '../services/StationService';

@Service()
export class SaleCommon {

  constructor(
    private readonly userService: UserService,
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly collectService: CollectMoneyService,
    private readonly stationService: StationService
  ) { }

  /**
   * Creates the structure of ticket to send a Cloud API
   * @param id Sale ID
   * @returns Object
   */
  async createStructureToSendCloud(id: string): Promise<any> {
    const relationFilter = {
      relation: [
        'products->product.taxes.measurementUnit',
        'client',
        'paymentTransaction.paymentMethod'
      ]
    };
    const sale = await this.saleService.getByIdAsync(id, relationFilter) as ISaleProjection;

    return {
      _id: sale?._id?.toString(),
      folio: sale?.folio,
      iva: sale?.iva,
      subtotal: sale?.subtotal,
      total: sale?.total,
      totalLetters: sale?.totalLetters,
      userId: sale?.user?.toString(),
      station: sale?.station?.toString(),
      products: sale?.products?.map((product: IProductProjection) => {
        return {
          _id: product?.product?._id?.toString(),
          name: product?.product?.name,
          description: product?.product?.description,
          quantity: product?.quantity,
          priceUnit: product?.product?.pricePublic,
          price: product?.product?.pricePublic * product?.quantity,
          measurementUnit: product?.product?.measurementUnit?.short,
          measurementUnitSat: product?.product?.measurementUnit?.keySat,
          taxes: product?.product?.taxes?.map((tax: Tax) => {
            return {
              percentage: tax?.percentage,
              name: tax?.name,
              _id: tax?._id?.toString()
            }
          }),
        }
      }),
      payments: [
        {
          quantity: sale?.paymentTransaction?.quantity,
          key: sale?.paymentTransaction?.paymentMethod?.key,
          description: sale?.paymentTransaction?.paymentMethod?.description,
          _id: sale?.paymentTransaction?.paymentMethod?._id?.toString()
        }
      ],
      client: {
        email: sale?.client?.email,
        _id: sale?.client?._id?.toString()
      }
    };
  }

  /**
   * Initialize a sale object
   * @param clientId Client ID
   * @param positionId Position ID
   * @param userId User ID
   * @returns Sale object
   */
  async initializeSaleObject(clientId: string, positionId: string, userId: string): Promise<any> {
    const [ lastSale, station ] = await Promise.all([
      this.saleService.getAllAsync({ sort: '-consecutive', page: 0, pageSize: 1 }),
      this.stationService.getOneAsync()
    ]);

    return { 
      client: clientId,
      position: positionId,
      user: userId,
      folio: 'RE' + new Date().getTime(),
      consecutive: R.isEmpty(lastSale) ? 1 : lastSale[0]?.consecutive + 1,
      station: station?._id
    };
  }

  /**
   * Calculate the total of sale
   * @param sale Sale instance
   * @returns Sale instance
   */
  async calculateTotalAsync(sale: Sale): Promise<Sale> {
    const productIds = sale?.products?.map((product: any) => product.product);

    const products = await this.productService.getAllAsync(
      { 
        criteria: { _id: { $in: productIds } 
      }, 
      relation: ['taxes'] 
    });
    const merged = products.merge(sale.products, '_id', 'product');

    const [ total, subtotal, iva ] = [ 
      this.getTotalOfSale(merged),
      this.getSubtotalOfSale(merged),
      this.getVatOfSale(merged) 
    ];
    const totalLetters = this.numberToLetter(total).trim();

    return Object.assign(sale, { total, subtotal, iva, totalLetters });
  }

  /**
   * Adds the amount paid by the customer to the user
   * @param userId 
   * @param sale
   * @returns Void
   */
  async chargeMoneyToUser(userId: string, sale: any): Promise<any> {
    const user = await this.userService.getByIdAsync(userId);

    for await (const payment of sale.payments) {
      if (payment?.key == '01') {
        user.cashMoneyAmount += payment.quantity;
        this.userService.saveAsync(user);
        return;
      }

      user.cardMoneyAmount += payment.quantity;
      this.userService.saveAsync(user);
    }
  }

  /**
   * Returns the report for the cut turn
   * @param intervals Object with start and end intervals of turn
   * @param userId User ID
   * @return Object with total products saled, payments and collects
   */
  async doReport(intervals: any, userId: string): Promise<any> {
    const { start, end } = intervals;
    const filterBase = { createdAt: { $gte: start, $lte: end }, user: userId };
    const filterSale = {
      criteria: R.merge(filterBase, { status: '201' }),
      relation: [
        'products->product',
        'paymentTransaction.paymentMethod'
      ]
    }

    const [ sales, collects ] = await Promise.all([
      this.saleService.getAllAsync(filterSale),
      this.collectService.getAllAsync({ criteria: filterBase })
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
   * @param number Quantity
   * @param currency Default currency
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
   * @param number Quantity
   * @returns Chain of unit
   */
  private getUnits (number: number): string | undefined {
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
   * @param label First label
   * @param numberUnits Unit quantity
   * @returns String concatenated
   */
  private getTensConcatenate (label: string, numberUnits: number): string {
    return numberUnits > 0 ? 
      label + ' Y ' + this.getUnits(numberUnits) :
      label;
  }

  /**
   * Gets chain of tens
   * @param number Quantity
   * @returns Chain of tens
   */
  private getTens (number: number): string | undefined {
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
   * @param number Quantity
   * @returns Chain of hundreds
   */
  private getHundreds (number: number): string | undefined {
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
   * @param number 
   * @param divider 
   * @param singular Quantity in singular
   * @param plural Quantity in plural
   * @returns Number in letters
   */
  private getSection (number: number, divider: number, singular: string, plural: string): string {
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
   * @param number Quantity
   * @returns Chain of thousands
   */
  private getThousands (number: number): string | undefined {
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
   * @param number Quantity
   * @returns Chain of thousands
   */
  private getMillions (number: number): string | undefined {
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
   * @param sales List of sales
   * @returns List of categories
   */
  private countProducts(sales: any[]): any[] {
    if (R.isEmpty(sales)) return [];

    const products = [];

    for (const sale of sales) {
      const flat = sale?.products;
      products.push(...flat);
    }

    const categories: any = [];

    for (const product of products) {
      const [ label, amount ] = [
        product?.product?.name,
        product?.product?.pricePublic
      ];
      const existsCategory = R.find(R.propEq('label', label))(categories);

      if (existsCategory) {
        const index = R.findIndex(R.propEq('label', label))(categories);
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
   * @param sales List of sales
   * @returns List of payments
   */
  private countPayments(sales: any[]): any[] {
    if (R.isEmpty(sales)) return [];

    const payments: any = [];

    for (const sale of sales) {
      const [label, amount] = [
        sale?.paymentTransaction?.paymentMethod?.name,
        sale?.paymentTransaction?.quantity
      ];
      const existsCategory = R.find(R.propEq('label', label))(payments);

      if (existsCategory) {
        const index = R.findIndex(R.propEq('label', label))(payments);
        payments[index].amount += amount;
      }
      else {
        payments.push({ label, amount });
      }
    }

    return payments;
  }

  /**
   * Gets the total of products
   * @param products List of products
   * @returns Total of products
   */
  private getTotalOfSale(products: any[]): number {
    return products.reduce((accumulator: number, product: any) => 
      accumulator + (R.pathOr(0, ['quantity'], product) * R.pathOr(0, ['pricePublic'], product)), 0);
  }

  /**
   * Gets the subtotal of products
   * @param products List of products
   * @returns Subtotal of products
   */
  private getSubtotalOfSale(products: any[]): number {
    return products.reduce((accumulator: number, product: any) => 
      accumulator + Math.floor(this.getPriceWithoutIva(product)), 0);
  }

  /**
   * Gets the vat of products
   * @param products List of products
   * @returns Vat of products
   */
  private getVatOfSale(products: any[]): number {
    return products.reduce((accumulator: number, product: any) =>
      accumulator + 
      ((R.pathOr(0, ['pricePublic'], product) * R.pathOr(0, ['quantity'], product)) - Math.floor(this.getPriceWithoutIva(product)))
    , 0);
  }

  /**
   * Gets the price of product without vat
   * @param product Product instance
   * @returns Price without vat
   */
  private getPriceWithoutIva(product: Product): number {
    const productQuantity = R.pathOr(0, ['quantity'], product);
    const tax = R.pathOr(0, ['taxes', '0', 'percentage'], product) * productQuantity;
    const pricePublic = R.pathOr(0, ['pricePublic'], product);

    return tax == 0 ?
      (pricePublic * productQuantity) / (1.16 * productQuantity) :
      (pricePublic * productQuantity) / (tax + 1);
  }

}