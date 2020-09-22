'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';
import { IPaymentMethod } from "../../Api.Domain/Models/IPaymentMethod";
import R from 'ramda';

class PaymentMethodMiddleware {

  private readonly _paymentMethodRepository: IRepository<IPaymentMethod>;

  constructor(paymentMethodRepository: IRepository<IPaymentMethod>) {
    this._paymentMethodRepository = paymentMethodRepository;
  }

  public existsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { params: { id }, body: { paymentMethodId } } = request;
    const cloneId = R.isEmpty(paymentMethodId) ? id : paymentMethodId;
    const paymentMethod = await this._paymentMethodRepository.getByIdAsync(cloneId, {});
    
    if (!paymentMethod) return ResponseDto.notFound(false, response, 'PaymentMethodNotFound');

    next();
  }

}

const paymentMethodMiddleware = new PaymentMethodMiddleware(resolveRepositories().paymentMethodRepository);

export { paymentMethodMiddleware };