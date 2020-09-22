'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IProduct } from '../../Api.Domain/Models/IProduct';
import { Product } from '../../Api.Domain/Models/Product';
import R from 'ramda';

@injectable()
class ProductRepository implements IRepository<IProduct> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Product
            .find(mongoFilter.criteria)
            .populate(R.pathOr('', ['relation', '0'], mongoFilter))
            .skip(R.pathOr(0, ['pagination', 'page'], mongoFilter))
            .limit(R.pathOr(0, ['pagination', 'pageSize'], mongoFilter))
            .sort(R.pathOr({}, ['sort'], mongoFilter));

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Product.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Product.findOne(mongoFilter.criteria);

    public createAsync = async (product: IProduct): Promise<any> => await Product.create(product);

    public updateByIdAsync = async (id: string, product: IProduct): Promise<any> => await Product.findOneAndUpdate({ _id: id }, { $set: product }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Product.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Product.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Product.countDocuments(mongoFilter.criteria);

}

export { ProductRepository };