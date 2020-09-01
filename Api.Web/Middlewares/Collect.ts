'use strict';

import { ICollectMoney } from "../../Api.Domain/Models/ICollectMoney";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class CollectMiddleware {

  private readonly _collectRepository: IRepository<ICollectMoney>;

  constructor (collectRepository: IRepository<ICollectMoney>) {
    this._collectRepository = collectRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id } } = request;
    const collect = await this._collectRepository.getByIdAsync(id, {});

    if (!collect) return ResponseDto.notFound(false, response, 'CollectNotFound');

    next();
  }

}

const collectMiddleware = new CollectMiddleware(resolveRepositories().collectRepository);

export { collectMiddleware };