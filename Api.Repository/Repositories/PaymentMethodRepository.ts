'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IPaymentMethod } from '../../Api.Domain/Models/IPaymentMethod';
import { PaymentMethod } from '../../Api.Domain/Models/PaymentMethod';

@injectable()
class PaymentMethodRepository implements IRepository<IPaymentMethod> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await PaymentMethod
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await PaymentMethod.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await PaymentMethod.findOne(mongoFilter.criteria);

    public createAsync = async (paymentMethod: IPaymentMethod): Promise<any> => await PaymentMethod.create(paymentMethod);

    public updateByIdAsync = async (id: string, paymentMethod: IPaymentMethod): Promise<any> => 
      await PaymentMethod.findOneAndUpdate({ _id: id }, { $set: paymentMethod }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await PaymentMethod.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await PaymentMethod.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await PaymentMethod.countDocuments(mongoFilter.criteria);

}

export { PaymentMethodRepository };