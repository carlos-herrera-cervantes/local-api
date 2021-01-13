import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { User } from '../models/User';
import { BaseService } from './BaseService';

@Service()
export class UserService extends BaseService {

  constructor(@Inject(User) private user: MongooseModel<User>) {
    super(user);
  }

}