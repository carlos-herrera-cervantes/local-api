import { Service } from '@tsed/common';
import { UserService } from '../services/UserService';
import { CollectMoneyService } from '../services/CollectService';
import { CollectMoney } from '../models/CollectMoney';
import { User } from '../models/User';
import * as R from 'ramda';

@Service()
export class CollectCommon {

  constructor(private readonly userService: UserService, private readonly collectService: CollectMoneyService) { }
  
  /**
   * Takes amount of cash or card money from user
   * @param id User ID
   * @param type Collect type: cash or card
   * @param amount Amount to take
   * @returns Void
   */
  async collectByType(id: string, type: string, amount: number): Promise<any> {
    const user = await this.userService.getByIdAsync(id);
    const selected = R.equals(type, 'cash') ? user.cashMoneyAmount : user.cardMoneyAmount;

    if (R.gt(amount, selected)) throw 'TakeQuantityCollect';

    const property = R.equals(type, 'cash') ? 'cashMoneyAmount' : 'cardMoneyAmount';
    user[property] = selected - amount;
    await this.userService.saveAsync(user);
  }

  /**
   * Takes amount both cash and card money from user
   * @param id User ID
   * @returns Void
   */
  async collectAll(id: string): Promise<any> {
    const user = await this.userService.getByIdAsync(id);
    const collects = R.map(fn => fn(user), [ this.checkCash, this.checkCard ])
    const promises: any = [];

    for (const collect of collects) {
      if (R.not(collect)) continue;
      promises.push(this.collectService.createAsync(collect as CollectMoney));
    }
    
    user.cashMoneyAmount = 0;
    user.cardMoneyAmount = 0;
    promises.push(this.userService.saveAsync(user));
    
    return await Promise.all(promises);
  }

  /** @Helpers */

  /**
   * Create a new collect object of cash
   * @param user User instance
   * @returns Object with fields to create a new collect of cash
   */
  private checkCash(user: User): object | boolean {
    const cashMoneyAmount = user.cashMoneyAmount;

    if (R.not(R.gt(cashMoneyAmount, 0))) return false;

    return { user: user._id, amount: cashMoneyAmount, type: 'cash' };
  }

  /**
   * Create a new collect object of card
   * @param user User instance
   * @returns Object with fields to create a new collect of card
   */
  private checkCard(user: User): object | boolean {
    const cardMoneyAmount = user.cardMoneyAmount

    if (R.not(R.gt(cardMoneyAmount, 0))) return false;

    return { user: user._id, amount: cardMoneyAmount, type: 'card' };
  }

}