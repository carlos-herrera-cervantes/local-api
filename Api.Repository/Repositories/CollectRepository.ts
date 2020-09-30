'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { ICollectMoney } from '../../Api.Domain/Models/ICollectMoney';
import { CollectMoney } from '../../Api.Domain/Models/CollectMoney';
import R from 'ramda';

@injectable()
class CollectRepository implements IRepository<ICollectMoney> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await CollectMoney
            .find(R.pathOr({}, ['criteria'], mongoFilter))
            .skip(R.pathOr(0, ['pagination', 'page'], mongoFilter))
            .limit(R.pathOr(0, ['pagination', 'pageSize'], mongoFilter))
            .sort(R.pathOr({}, ['sort'], mongoFilter));

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await CollectMoney.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await CollectMoney.findOne(mongoFilter.criteria);

    public createAsync = async (collect: ICollectMoney): Promise<any> => await CollectMoney.create(collect);

    public updateByIdAsync = async (id: string, collect: ICollectMoney): Promise<any> => await CollectMoney.findOneAndUpdate({ _id: id }, { $set: collect }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await CollectMoney.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await CollectMoney.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await CollectMoney.countDocuments(mongoFilter.criteria);

}

export { CollectRepository };