import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Tax } from '../models/Tax';
import { BaseService } from './BaseService';

@Service()
export class TaxService extends BaseService {

  constructor(@Inject(Tax) private tax: MongooseModel<Tax>) {
    super(tax);
  }

}