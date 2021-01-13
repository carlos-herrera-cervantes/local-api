import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Sale } from '../models/Sale';
import { BaseService } from './BaseService';

@Service()
export class SaleService extends BaseService {

  constructor(@Inject(Sale) private sale: MongooseModel<Sale>) {
    super(sale);
  }

}