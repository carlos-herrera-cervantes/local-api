import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class CustomersService extends BaseService {

  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {
    super(customerModel);
  }

}