'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IPaymentTransaction } from '../../Api.Domain/Models/IPaymentTransaction';
import { PaymentTransaction } from '../../Api.Domain/Models/PaymentTransaction';

@injectable()
class PaymentTransactionRepository implements IRepository<IPaymentTransaction> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await PaymentTransaction
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await PaymentTransaction.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await PaymentTransaction.findOne(mongoFilter.criteria);

    public createAsync = async (paymentTransaction: IPaymentTransaction): Promise<any> => await PaymentTransaction.create(paymentTransaction);

    public updateByIdAsync = async (id: string, paymentTransaction: IPaymentTransaction): Promise<any> => await PaymentTransaction.findOneAndUpdate({ _id: id }, { $set: paymentTransaction }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await PaymentTransaction.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await PaymentTransaction.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await PaymentTransaction.countDocuments(mongoFilter.criteria);

}

export { PaymentTransactionRepository };