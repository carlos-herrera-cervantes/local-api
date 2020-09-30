'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IUser } from "../../Api.Domain/Models/IUser";
import R from "ramda";
import { CollectMoney } from "../../Api.Domain/Models/CollectMoney";
import { resolveRepositories } from "../Config/Container";
import { ICollectMoney } from "../../Api.Domain/Models/ICollectMoney";

class CollectModule {

  private readonly _userRepository: IRepository<IUser>;
  private readonly _collectRepository: IRepository<ICollectMoney>;

  constructor (userRepository: IRepository<IUser>, collectRepository: IRepository<ICollectMoney>) {
    this._userRepository = userRepository;
    this._collectRepository = collectRepository;
  }

  public collectByType = async (id: string, type: string, amount: number): Promise<any> => {
    const user = await this._userRepository.getByIdAsync(id, {});
    const selected = R.equals(type, 'cash') ? user.cashMoneyAmount : user.cardMoneyAmount;

    if (R.gt(amount, selected)) throw 'TakeQuantityCollect';

    const property = R.equals(type, 'cash') ? 'cashMoneyAmount' : 'cardMoneyAmount';
    user[property] = selected - amount;
    user.save();
  }

  public collectAll = async (id: string): Promise<any> => {
    const user = await this._userRepository.getByIdAsync(id, {});
    const collects = R.map(fn => fn(user), [ this.checkCash, this.checkCard ])
    const promises = [];

    for (const collect of collects) {
      if (R.not(collect)) continue;
      promises.push(this._collectRepository.createAsync(collect));
    }
    
    user.cashMoneyAmount = 0;
    user.cardMoneyAmount = 0;
    user.save();
    
    return await Promise.all(promises);
  }

  private checkCash = (user: IUser): any => {
    const cashMoneyAmount = user.cashMoneyAmount;

    if (R.not(R.gt(cashMoneyAmount, 0))) return false;

    return new CollectMoney({ userId: user._id, amount: cashMoneyAmount, type: 'cash' });
  }

  private checkCard = (user: IUser): any => {
    const cardMoneyAmount = user.cardMoneyAmount

    if (R.not(R.gt(cardMoneyAmount, 0))) return false;

    return new CollectMoney({ userId: user._id, amount: cardMoneyAmount, type: 'card' });
  }

}

const collectModule = new CollectModule(resolveRepositories().userRepository, resolveRepositories().collectRepository);

export { collectModule };