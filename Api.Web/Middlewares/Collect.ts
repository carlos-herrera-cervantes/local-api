'use strict';

import { ICollectMoney } from "../../Api.Domain/Models/ICollectMoney";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';
import R from "ramda";
import { collectModule } from "../Modules/CollectModule";

class CollectMiddleware {

  private readonly _collectRepository: IRepository<ICollectMoney>;

  constructor (collectRepository: IRepository<ICollectMoney>) {
    this._collectRepository = collectRepository;
  }

  public existsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { params: { id } } = request;
    const collect = await this._collectRepository.getByIdAsync(id, {});

    if (!collect) return ResponseDto.notFound(false, response, 'CollectNotFound');

    next();
  }

  public isValidQuantity = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    try {
      const { body, headers: { userId } } = request;
    
      if (R.isNil(body.type)) return ResponseDto.badRequest(false, response, 'TypeCollect');

      if (R.isNil(body.amount)) return ResponseDto.badRequest(false, response, 'QuantityCollect');

      await collectModule.collectByType(userId as string, body.type, body.amount);
      request.body.userId = userId;
      next();
    }
    catch (error) {
      return ResponseDto.badRequest(false, response, 'TakeQuantityCollect');
    }
  }

}

const collectMiddleware = new CollectMiddleware(resolveRepositories().collectRepository);

export { collectMiddleware };