'use strict';

import { IShopping } from "../../Api.Domain/Models/IShopping";
import { Shopping } from "../../Api.Domain/Models/Shopping";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { resolveRepositories } from "../Config/Container";
import { Request as RequestDto} from '../Models/Request';
import { Types } from 'mongoose';
import R from 'ramda';
import { IProduct } from "../../Api.Domain/Models/IProduct";
import '../Extensions/ArrayExtensions';

class ShoppingModule {

  private readonly _shoppingRepository: IRepository<IShopping>;
  private readonly _productRepository: IRepository<IProduct>;

  constructor (shoppingRepository: IRepository<IShopping>, productRepository: IRepository<IProduct>) {
    this._shoppingRepository = shoppingRepository;
    this._productRepository = productRepository;
  }

  public createStructureToSendCloud = async (id: string): Promise<any> => {
    const shopping = await this._shoppingRepository.getByIdAsync(id, {
      relation: [
        'products->productId.taxes.measurementUnitId',
        'clientId',
        'paymentTransactionId.paymentMethodId'
      ]
    });

    const shoppingJson = shopping.toObject({ virtuals: true });
    const data = {
      Folio: R.pathOr('', ['folio'], shoppingJson),
      Iva: R.pathOr(0, ['iva'], shoppingJson),
      Subtotal: R.pathOr(0, ['subtotal'], shoppingJson),
      Total: R.pathOr(0, ['total'], shoppingJson),
      TotalLetters: R.pathOr('', ['totalLetters'], shoppingJson),
      UserId: R.pathOr('', ['userId'], shoppingJson),
      Products: shoppingJson.products.map(product => (
        {
          id: R.pathOr('', ['_id'], product),
          Name: R.pathOr('', ['productId', 'name'], product),
          Description: R.pathOr('', ['productId', 'description'], product),
          Quantity: R.pathOr(0, ['quantity'], product),
          PriceUnit: R.pathOr(0, ['productId', 'pricePublic'], product),
          Price: R.pathOr(0, ['productId', 'pricePublic'], product) * R.pathOr(0, ['quantity'], product),
          MeasurementUnit: R.pathOr('', ['productId', 'measurementUnitId', 'name'], product),
          MeasurementUnitSat: R.pathOr('', ['productId', 'measurementUnitId', 'keySat'], product),
          Taxes: product.productId.taxes.map(tax => (
            {
              Percentage: R.pathOr(0, ['percentage',], tax),
              Name: R.pathOr('', ['name',], tax),
              id: R.pathOr('', ['_id'], tax)
            }
          ))
        })),
      Payments: [
        {
          Quantity: R.pathOr(0, ['paymentTransactionId', 'quantity'], shoppingJson),
          Key: R.pathOr('', ['paymentTransactionId', 'paymentMethodId', 'key'], shoppingJson),
          Description: R.pathOr('', ['paymentTransactionId', 'paymentMethodId', 'description'], shoppingJson),
          id: R.pathOr('', ['paymentTransactionId', 'paymentMethodId', '_id'], shoppingJson)
        }
      ],
      Client: {
        Email: R.pathOr('', ['clientId', 'email'], shoppingJson),
        id: R.pathOr('', ['clientId', '_id'], shoppingJson)
      }
    };

    return data;
  }

  public createShoppingObject = async (clientId: string, positionId: string, userId: string): Promise<IShopping> => {
    const shopping = new Shopping({ clientId, positionId });
    this.generateFolio(shopping);
    this.assignUserId(Types.ObjectId(userId), shopping);
    await this.generateConsecutiveNumber(shopping);
    return shopping;
  }

  public assignUserId (userId: Types.ObjectId, shopping: IShopping): IShopping {
    shopping.userId = userId;
    return shopping;
  }

  public generateFolio (shopping: IShopping): IShopping {
    shopping.folio = 'RE' + new Date().getTime();
    return shopping;
  }

  public generateConsecutiveNumber = async (shopping: IShopping): Promise<IShopping> => {
    const query = { sort: '-consecutive', paginate: true, page: 1, pageSize: 1 };
    const dto = new RequestDto(query).setSort().setPagination();
    const lastShopping = await this._shoppingRepository.getAllAsync(dto.queryFilter);
    
    shopping.consecutive = R.isEmpty(lastShopping) ? 1 : lastShopping.pop().consecutive + 1;
    return shopping;
  }

  public calculateTotal = async (shopping: IShopping): Promise<IShopping> => {
    const productsIds = shopping.products.map(product => product.productId);
    const products = await this._productRepository.getAllAsync({ criteria: { _id: { $in: productsIds } }, relation: ['taxes'] });
    const merged = products.mergeWithArrayById(shopping.products);
    const total = merged.getTotalOfShopping();
    const subtotal = merged.getSubtotalOfShopping();
    const iva = merged.getIvaOfShopping();
    const totalLetters = this.getNumberToLetter(total).trim();
    
    return Object.assign(shopping.toObject(), { total, subtotal, iva, totalLetters });
  }

  private getNumberToLetter (number: number, currency?: any): string {
    const cloneCurrency = currency || {};
    const data = {
      number,
      integers: Math.floor(number),
      pennies: Math.round(number * 100) - Math.floor(number) * 100,
      letterPennies: '',
      letterCoinPlural: cloneCurrency.plural || 'PESOS',
      letterCoinSingular: cloneCurrency.singular || 'PESO',
      letterCoinPenniesPlural: cloneCurrency.centPlural || 'CENTAVOS',
      letterCoinPenniesSingular: cloneCurrency.centSingular || 'CENTAVO',
    };
    
    if (R.gt(data.pennies, 0)) {
      data.letterPennies = 'CON ' + R.equals(data.pennies, 1) ? 
        this.getMillions(data.pennies) + ' ' + data.letterCoinPenniesSingular :
        this.getMillions(data.pennies) + ' ' + data.letterCoinPenniesPlural;
    }

    if (R.equals(data.integers, 0)) return 'CERO ' + data.letterCoinPlural + ' ' + data.letterPennies;

    return R.equals(data.integers, 1) ? this.getMillions(data.integers) + ' ' + data.letterCoinSingular + ' ' + data.letterPennies :
      this.getMillions(data.integers) + ' ' + data.letterCoinPlural + ' ' + data.letterPennies;
  }

  private getUnits (number: number): string {
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

  private getTensConcatenate (label: string, numberUnits: number): string {
    if (R.gt(numberUnits, 0)) return label + ' Y ' + this.getUnits(numberUnits);
    return label;
  }

  private getTens (number: number): string {
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

  private getHundreds (number: number) {
    const hundreds = Math.floor(number / 100);
    const tens = number - hundreds * 100;

    switch (hundreds) {
      case 1:
        if (R.gt(tens, 0)) return 'CIENTO ' + this.getTens(tens);
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

  private getSection (number: number, divider: number, singular: string, plural: string): string {
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;
    let letters = '';

    if (R.gt(hundreds, 0)) {
      letters = R.gt(hundreds, 1) ? this.getHundreds(hundreds) + ' ' + plural : singular;
    }
    
    if (R.gt(residue, 0)) letters += '';

    return letters;
  }

  private getThousands (number: number): string {
    const divider = 1000
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;
    const stringThousands = this.getSection(number, divider, 'UN MIL', 'MIL')
    const stringHundreds = this.getHundreds(residue);
    
    if (R.equals(stringThousands, '')) return stringHundreds;

    return stringThousands + ' ' + stringHundreds;
  }

  private getMillions (number: number): string {
    const divider = 1000000;
    const hundreds = Math.floor(number / divider);
    const residue = number - hundreds * divider;

    const stringMillions = this.getSection(number, divider, 'UN MILLON DE', 'MILLONES DE');
    const stringThousands = this.getThousands(residue);
    
    if (R.equals(stringMillions, '')) return stringThousands;

    return stringMillions + ' ' + stringThousands;
  }

}

const shoppingModule = new ShoppingModule(resolveRepositories().shoppingRepository, resolveRepositories().productRepository);

export { shoppingModule };