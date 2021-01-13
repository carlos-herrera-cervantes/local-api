import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { extend } from "dayjs";
import { CollectMoney } from '../models/CollectMoney';
import { BaseService } from './BaseService';

@Service()
export class CollectMoneyService extends BaseService {

  constructor(@Inject(CollectMoney) private collectMoney: MongooseModel<CollectMoney>) {
    super(collectMoney);
  }

}