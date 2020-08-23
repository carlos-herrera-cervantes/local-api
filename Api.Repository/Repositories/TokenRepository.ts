'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IToken } from '../../Api.Domain/Models/IToken';
import { Token } from '../../Api.Domain/Models/Token';

@injectable()
class TokenRepository implements IRepository<IToken> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Token
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Token.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Token.findOne(mongoFilter.criteria);

    public createAsync = async (token: IToken): Promise<any> => await Token.create(token);

    public updateByIdAsync = async (id: string, token: IToken): Promise<any> => await Token.findOneAndUpdate({ _id: id }, { $set: token }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Token.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Token.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Token.countDocuments(mongoFilter.criteria);

}

export { TokenRepository };