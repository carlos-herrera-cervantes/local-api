import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentMethod, PaymentMethodDocument } from './schemas/paymentMethod.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class PaymentMethodService extends BaseService {
  
  constructor(@InjectModel(PaymentMethod.name) private paymentMethodModel: Model<PaymentMethodDocument>) {
    super(paymentMethodModel);
  }

}