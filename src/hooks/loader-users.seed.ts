import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import users from '../scripts/users.json';
import { IMongoDBFilter } from "../base/entities/mongodb-filter.entity";

@Injectable()
export class LoaderUsers implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(LoaderUsers.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') == 'test') return;

    const totalUsers = await this.usersService.getAllAsync({
      criteria: { email: users[0]?.email },
    } as IMongoDBFilter);

    if (totalUsers.length > 0) {
      this.logger.log({
        datetime: new Date(),
        appId: '',
        event: 'seed_users_success',
        level: 'INFO',
        description: 'The basic users to login have already been created'
      });

      return;
    }

    await this.usersService.createManyAsync(users as CreateUserDto[])
      .catch(err => this.logger.error({
        datetime: new Date(),
        appId: '',
        event: 'seed_users_fail',
        level: 'ERROR',
        description: 'Something went wrong trying to create the basic users: ' + err?.message
      }));

    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'seed_users_success',
      level: 'INFO',
      description: 'The basic users to login have been created successfully'
    });
  }

}