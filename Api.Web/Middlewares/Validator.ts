'use strict';

import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { StringExtensions } from '../Extensions/StringExtensions';
import { ResponseDto } from '../Models/Response';
import R from 'ramda';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { IToken } from '../../Api.Domain/Models/IToken';
import { resolveRepositories } from '../Config/Container';

class Validator {

  private readonly _tokenRepository: IRepository<IToken>;

  constructor (tokenRepository: IRepository<IToken>) {
    this._tokenRepository = tokenRepository;
  }

  public isValidObjectId (request: Request, response: Response, next: NextFunction): any {
    const { params: { id } } = request;
    const isInvalidId = !ObjectID.isValid(id);

    if (isInvalidId) {
      return ResponseDto.badRequest(false, response, 'InvalidObjectId');
    }

    next();
  }

  public validatePagination (request: Request, response: Response, next: NextFunction): any {
    const { query: { paginate, page, pageSize } } = request;

    if (!paginate) {
      return next();
    }

    const notHavePages = !page || !pageSize;
    const invalidPaginateParams = StringExtensions.toBoolean(paginate) && notHavePages;

    if (invalidPaginateParams) {
      return ResponseDto.badRequest(false, response, 'InvalidPaginateParams');
    }

    const intPage = StringExtensions.toInt(page);
    const intPageSize = StringExtensions.toInt(pageSize);
    const invalidPages = intPage <= 0 || intPageSize <= 0 || intPageSize > 100;

    if (invalidPages) {
      return ResponseDto.badRequest(false, response, 'InvalidPaginateNumbers');
    }

    next();
  }

  public validateRole = (...roles) => async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { headers: { authorization } } = request;
    const extractedToken = authorization.split(' ').pop();
    const token = await this._tokenRepository.getOneAsync({ criteria: { token: extractedToken } });
    const isValidRole = roles.includes(R.pathOr('', ['role'], token));

    if (isValidRole) {
      return next();
    }

    return ResponseDto.unauthorize(false, response, 'AccessDenied');
  }

}

const validator = new Validator(resolveRepositories().tokenRepository);

export { validator };