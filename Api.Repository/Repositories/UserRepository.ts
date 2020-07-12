'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IRepository } from './IRepository';
import { IUser } from '../../Api.Domain/Models/IUser';
import { User } from '../../Api.Domain/Models/User';

@injectable()
class UserRepository implements IRepository<IUser> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await User
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await User.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await User.findOne(mongoFilter.criteria);

    public createAsync = async (user: IUser): Promise<any> => await User.create(user);

    public updateByIdAsync = async (id: string, user: IUser): Promise<any> => await User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await User.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await User.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await User.countDocuments(mongoFilter.criteria);

}

export { UserRepository };