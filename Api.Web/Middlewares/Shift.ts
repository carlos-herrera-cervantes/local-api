'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IShift } from "../../Api.Domain/Models/IShift";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class ShiftMiddleware {

  private readonly _shiftRepository: IRepository<IShift>;

  constructor (shiftRepository: IRepository<IShift>) {
    this._shiftRepository = shiftRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id }} = request;
    const shift = await this._shiftRepository.getByIdAsync(id, {});

    if (!shift) return ResponseDto.notFound(false, response, 'ShiftNotFound');

    next();
  }

}

const shiftMiddleware = new ShiftMiddleware(resolveRepositories().shiftRepository);

export { shiftMiddleware };