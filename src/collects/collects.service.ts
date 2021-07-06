import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CollectMoney, CollectMoneyDocument } from './schemas/collect.schema';
import { UsersService } from '../users/users.service';
import { BaseService } from '../base/base.service';
import { User } from '../users/schemas/user.schema';
import { successCreatedCollectEvent } from './logger/index';

@Injectable()
export class CollectMoneyService extends BaseService {
  private readonly logger = new Logger(CollectMoneyService.name);
  
  constructor(
    @InjectModel(CollectMoney.name)
    private collectMoneyModel: Model<CollectMoneyDocument>,
    private usersService: UsersService
  ) {
    super(collectMoneyModel);
  }

  /**
   * Takes amount of cash or card money from user
   * @param {string} id User ID
   * @param {string} type Collect type: cash or card
   * @param {number} amount Amount to take
   */
  async collectByTypeAsync(userId: string, type: string, amount: number): Promise<User> {
    const user = await this.usersService.getByIdAsync(userId);
    const typeCollect = type.toLowerCase() == 'cash';
    const accumulated = typeCollect ? user?.cashMoneyAmount : user?.cardMoneyAmount;

    if (amount > accumulated) {
      const exception = new Error('TakeQuantityCollectException');
      throw exception;
    }

    const property = typeCollect ? 'cashMoneyAmount' : 'cardMoneyAmount';
    user[property] = accumulated - amount;
    await this.usersService.saveAsync(user);

    this.logger.log(successCreatedCollectEvent(type, amount, userId));

    return user;
  }

  /**
   * Takes amount both cash and card money from user
   * @param {string} id User ID
   */
  async collectAllAsync(userId: string): Promise<User> {
    const user = await this.usersService.getByIdAsync(userId);
    const collects = [this.checkCash, this.checkCard].map(fn => fn(user));
    const promises = [];

    for (const collect of collects) {
      if (!collect) continue;

      promises.push(super.createAsync(collect));
    }

    user.cashMoneyAmount = 0;
    user.cardMoneyAmount = 0;
    promises.push(this.usersService.saveAsync(user));

    await Promise.all(promises);

    return user;
  }

  /**
   * Create a new collect object of cash
   * @param {User} user User instance
   * @returns Object with fields to create a new collect of cash
   */
   private checkCash(user: any): object | boolean {
    const cashMoneyAmount = user.cashMoneyAmount;

    if (!(cashMoneyAmount > 0)) return false;

    return { user: user._id, amount: cashMoneyAmount, type: 'cash' };
  }

  /**
   * Create a new collect object of card
   * @param {User} user User instance
   * @returns Object with fields to create a new collect of card
   */
   private checkCard(user: any): object | boolean {
    const cardMoneyAmount = user.cardMoneyAmount

    if (!(cardMoneyAmount > 0)) return false;

    return { user: user._id, amount: cardMoneyAmount, type: 'card' };
  }
}