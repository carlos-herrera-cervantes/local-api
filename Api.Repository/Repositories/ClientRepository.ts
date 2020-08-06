'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IClient } from '../../Api.Domain/Models/IClient';
import { Client } from '../../Api.Domain/Models/Client';

@injectable()
class ClientRepository implements IRepository<IClient> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Client
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Client.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Client.findOne(mongoFilter.criteria);

    public createAsync = async (client: IClient): Promise<any> => await Client.create(client);

    public updateByIdAsync = async (id: string, client: IClient): Promise<any> => await Client.findOneAndUpdate({ _id: id }, { $set: client }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Client.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Client.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Client.countDocuments(mongoFilter.criteria);

}

export { ClientRepository };