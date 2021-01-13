import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Client } from '../models/Client';
import { BaseService } from './BaseService';

@Service()
export class ClientService extends BaseService {

  constructor(@Inject(Client) private client: MongooseModel<Client>) {
    super(client);
  }

}