'use strict';

import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { ResponseDto } from '../Models/Response';
import R from 'ramda';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { resolveRepositories } from '../Config/Container';
import { IProduct } from '../../Api.Domain/Models/IProduct';
import '../Extensions/StringExtensions';

class Validator {

  private readonly _productRepository: IRepository<IProduct>;

  constructor (productRepository: IRepository<IProduct>) {
    this._productRepository = productRepository;
  }

  public isValidObjectId (request: Request, response: Response, next: NextFunction): any {
    const { params: { id } } = request;
    const isInvalidId = !ObjectID.isValid(id);

    if (isInvalidId) return ResponseDto.badRequest(false, response, 'InvalidObjectId');

    next();
  }

  public validatePagination (request: Request, response: Response, next: NextFunction): any {
    const { query: { paginate, page, pageSize } } = request;

    if (R.isNil(paginate)) return next();

    const notHavePages = R.or(R.isNil(page), R.isNil(pageSize));
    const invalidPaginateParams = R.and((paginate as string || 'false').toBoolean(), notHavePages);

    if (invalidPaginateParams) return ResponseDto.badRequest(false, response, 'InvalidPaginateParams');

    const intPage = parseInt(page as string);
    const intPageSize = parseInt(pageSize as string);
    const invalidPages = R.lte(intPage, 0) || R.lte(intPageSize, 0) || R.gt(intPageSize, 100);

    if (invalidPages) return ResponseDto.badRequest(false, response, 'InvalidPaginateNumbers');

    next();
  }

  public validateRole = (...roles) => async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { headers: { role } } = request;
    const isValidRole = roles.includes(role);

    if (isValidRole) return next();

    return ResponseDto.unauthorize(false, response, 'AccessDenied');
  }

  public validateProduct = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { body: { products } } = request;

    if (R.not(Array.isArray(products))) return ResponseDto.badRequest(false, response, 'InvalidPayloadProduct');

    products.forEach(product =>
      R.not(R.hasIn('productId', product)) ? ResponseDto.badRequest(false, response, 'InvalidPropertyIdProduct') :
      R.not(R.hasIn('quantity', product)) ? ResponseDto.badRequest(false, response, 'InvalidPropertyQuantityProduct') : 
      true
    );

    const productsIds = products.map(product => product.productId);
    const filter = { criteria: { _id: { $in: productsIds } } };
    const result = await this._productRepository.getAllAsync(filter);
    
    if (R.not(R.equals(productsIds.length, result.length))) return ResponseDto.badRequest(false, response, 'InvalidProduct');

    next();
  }

}

const validator = new Validator(resolveRepositories().productRepository);

export { validator };