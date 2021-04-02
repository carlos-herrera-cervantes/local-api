import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { AppClient } from '../models/AppClient';
import { BaseService } from './BaseService';

@Service()
export class AppClientService extends BaseService {

  constructor(@Inject(AppClient) private appClient: MongooseModel<AppClient>) {
    super(appClient);
  }

}