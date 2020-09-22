'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IShopping } from '../../Api.Domain/Models/IShopping';
import { Shopping } from '../../Api.Domain/Models/Shopping';
import { MongoDBModule } from '../Modules/MongoDBModule';

@injectable()
class ShoppingRepository implements IRepository<IShopping> {

    public getAllAsync = async (mongoFilter: any): Promise<any> => {
        const model = MongoDBModule.buildFilter(Shopping, mongoFilter);

        return await model
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);
    }

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await MongoDBModule.buildFilter(Shopping, mongoFilter, 'findById', id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Shopping.findOne(mongoFilter.criteria);

    public createAsync = async (shopping: IShopping): Promise<any> => await Shopping.create(shopping);

    public updateByIdAsync = async (id: string, shopping: IShopping): Promise<any> => await Shopping.findOneAndUpdate({ _id: id }, { $set: shopping }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Shopping.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Shopping.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Shopping.countDocuments(mongoFilter.criteria);

}

export { ShoppingRepository };