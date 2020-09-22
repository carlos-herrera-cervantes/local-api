'use strict';

import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { StringExtensions } from '../Extensions/StringExtensions';
import { ResponseDto } from '../Models/Response';
import R from 'ramda';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { IToken } from '../../Api.Domain/Models/IToken';
import { resolveRepositories } from '../Config/Container';
import { IProduct } from '../../Api.Domain/Models/IProduct';
import { ObjectExtensions } from '../Extensions/ObjectExtensions';

class Validator {

  private readonly _tokenRepository: IRepository<IToken>;
  private readonly _productRepository: IRepository<IProduct>;

  constructor (tokenRepository: IRepository<IToken>, productRepository: IRepository<IProduct>) {
    this._tokenRepository = tokenRepository;
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

    if (!paginate) return next();

    const notHavePages = !page || !pageSize;
    const invalidPaginateParams = StringExtensions.toBoolean(paginate) && notHavePages;

    if (invalidPaginateParams) return ResponseDto.badRequest(false, response, 'InvalidPaginateParams');

    const intPage = StringExtensions.toInt(page);
    const intPageSize = StringExtensions.toInt(pageSize);
    const invalidPages = intPage <= 0 || intPageSize <= 0 || intPageSize > 100;

    if (invalidPages) return ResponseDto.badRequest(false, response, 'InvalidPaginateNumbers');

    next();
  }

  public validateRole = (...roles) => async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { headers: { authorization } } = request;
    const extractedToken = authorization.split(' ').pop();
    const token = await this._tokenRepository.getOneAsync({ criteria: { token: extractedToken } });
    const isValidRole = roles.includes(R.pathOr('', ['role'], token));

    if (isValidRole) return next();

    return ResponseDto.unauthorize(false, response, 'AccessDenied');
  }

  public validateProduct = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { body: { products } } = request;

    if (!Array.isArray(products)) return ResponseDto.badRequest(false, response, 'InvalidPayloadProduct');

    products.forEach(product =>
      !ObjectExtensions.containsKey(product, 'productId') ? ResponseDto.badRequest(false, response, 'InvalidPropertyIdProduct') :
      !ObjectExtensions.containsKey(product, 'quantity') ? ResponseDto.badRequest(false, response, 'InvalidPropertyQuantityProduct') : 
      true
    );

    const productsIds = products.map(product => product.productId);
    const filter = { criteria: { _id: { $in: productsIds } } };
    const result = await this._productRepository.getAllAsync(filter);
    
    if (!R.equals(productsIds.length, result.length)) return ResponseDto.badRequest(false, response, 'InvalidProduct');

    next();
  }

}

const validator = new Validator(resolveRepositories().tokenRepository, resolveRepositories().productRepository);

export { validator };