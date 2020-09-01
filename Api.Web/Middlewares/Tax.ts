'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { ITax } from "../../Api.Domain/Models/ITax";
import { NextFunction, Request, Response } from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class TaxMiddleware {

  private readonly _taxRepository: IRepository<ITax>;

  constructor (taxRepository: IRepository<ITax>) {
    this._taxRepository = taxRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id } } = request;
    const tax = await this._taxRepository.getByIdAsync(id, {});

    if (!tax) return ResponseDto.notFound(false, response, 'TaxNotFound');

    next();
  }

}

const taxMiddleware = new TaxMiddleware(resolveRepositories().taxRepository);

export { taxMiddleware };