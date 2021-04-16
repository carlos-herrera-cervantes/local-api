import {Constant, Inject, Service} from "@tsed/common";
import {Env} from "@tsed/core";
import {MongooseModel} from "@tsed/mongoose";
import {Roles} from "../constants/Roles";
import {User} from "../models/User";
import {BaseService} from "./BaseService";

@Service()
export class UserService extends BaseService {
  @Constant("env")
  env: Env;

  constructor(@Inject(User) private user: MongooseModel<User>) {
    super(user);
  }

  async $onInit() {
    if (this.env === Env.DEV) {
      const result = await this.user.countDocuments();

      if (!result) {
        const user = new this.user({
          email: "admin@api.com",
          firstName: "john",
          lastName: "doe",
          password: "admin@api.com",
          role: Roles.SuperAdmin
        });

        await user.save()
      }
    }
  }
}