import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { BaseService } from '../base/base.service';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService {
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashingService: HashingService
  ) {
    super(userModel);
  }

  async createAsync(user: CreateUserDto): Promise<User> {
    user.password = await this.hashingService.hashAsync(user.password);
    
    const created = await super.createAsync(user);
    delete created?.password;

    return created;
  }

  async createManyAsync(users: CreateUserDto[]): Promise<User[]> {
    for (const user of users) {
      user.password = await this.hashingService.hashAsync(user.password);
    }

    return await super.createManyAsync(users);
  }

  async updateOneByIdAsync(id: string, user: UpdateUserDto): Promise<User> {
    if (user.password) {
      user.password = await this.hashingService.hashAsync(user.password);
    }

    const updated = await super.updateOneByIdAsync(id, user);
    delete updated?.password;

    return updated;
  }

}