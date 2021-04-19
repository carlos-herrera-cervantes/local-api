import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentTransaction, PaymentTransactionDocument } from './schemas/paymentTransaction.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class PaymentTransactionService extends BaseService {
  
  constructor(
      @InjectModel(PaymentTransaction.name)
      private paymentTransactionModel: Model<PaymentTransactionDocument>
    ) {
    super(paymentTransactionModel);
  }

}