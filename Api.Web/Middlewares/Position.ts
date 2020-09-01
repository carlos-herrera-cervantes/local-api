'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IPosition } from "../../Api.Domain/Models/IPosition";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class PositionMiddleware {

  private readonly _positionRepository: IRepository<IPosition>;

  constructor(positionRepository: IRepository<IPosition>) {
    this._positionRepository = positionRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id } } = request;
    const position = await this._positionRepository.getByIdAsync(id, {});

    if (!position) return ResponseDto.notFound(false, response, 'PositionNotFound');

    next();
  }

}

const positionMiddleware = new PositionMiddleware(resolveRepositories().positionRepository);

export { positionMiddleware };