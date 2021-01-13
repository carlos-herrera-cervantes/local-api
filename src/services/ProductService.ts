import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Product } from '../models/Product';
import { BaseService } from './BaseService';

@Service()
export class ProductService extends BaseService {

  constructor(@Inject(Product) private product: MongooseModel<Product>) {
    super(product);
  }

}