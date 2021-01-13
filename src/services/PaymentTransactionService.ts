import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { PaymentTransaction } from '../models/PaymentTransaction';
import { BaseService } from './BaseService';

@Service()
export class PaymentTransactionService extends BaseService {

  constructor(
    @Inject(PaymentTransaction)
    private paymentTransaction: MongooseModel<PaymentTransaction>
  ) {
    super(paymentTransaction);
  }

}