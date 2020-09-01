'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IShopping } from "../../Api.Domain/Models/IShopping";
import { NextFunction, Request, Response } from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class ShoppingMiddleware {

  private readonly _shoppingRepository: IRepository<IShopping>;

  constructor (shoppingRepository: IRepository<IShopping>) {
    this._shoppingRepository = shoppingRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id }} = request;
    const shopping = await this._shoppingRepository.getByIdAsync(id, {});

    if (!shopping) return ResponseDto.notFound(false, response, 'ShoppingNotFound');

    next();
  }

}

const shoppingMiddleware = new ShoppingMiddleware(resolveRepositories().shoppingRepository);

export { shoppingMiddleware };