'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IProduct } from "../../Api.Domain/Models/IProduct";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class ProductMiddleware {

  private readonly _productRepository: IRepository<IProduct>;

  constructor(productRepository: IRepository<IProduct>) {
    this._productRepository = productRepository;
  }

  public existsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { params: { id } } = request;
    const position = await this._productRepository.getByIdAsync(id, {});

    if (!position) return ResponseDto.notFound(false, response, 'ProductNotFound');

    next();
  }

}

const productMiddleware = new ProductMiddleware(resolveRepositories().productRepository);

export { productMiddleware };