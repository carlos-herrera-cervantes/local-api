'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { ITax } from '../../Api.Domain/Models/ITax';
import { Tax } from '../../Api.Domain/Models/Tax';

@injectable()
class TaxRepository implements IRepository<ITax> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Tax
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Tax.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Tax.findOne(mongoFilter.criteria);

    public createAsync = async (tax: ITax): Promise<any> => await Tax.create(tax);

    public updateByIdAsync = async (id: string, tax: ITax): Promise<any> => await Tax.findOneAndUpdate({ _id: id }, { $set: tax }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Tax.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Tax.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Tax.countDocuments(mongoFilter.criteria);

}

export { TaxRepository };