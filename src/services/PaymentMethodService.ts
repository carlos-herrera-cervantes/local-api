import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { PaymentMethod } from '../models/PaymentMethod';
import { BaseService } from './BaseService';

@Service()
export class PaymentMethodService extends BaseService {

  constructor(@Inject(PaymentMethod) private paymentMethod: MongooseModel<PaymentMethod>) {
    super(paymentMethod);
  }

}