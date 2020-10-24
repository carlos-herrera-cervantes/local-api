'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IStation } from '../../Api.Domain/Models/IStation';
import { Station } from '../../Api.Domain/Models/Station';

@injectable()
class StationRepository implements IRepository<IStation> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Station
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Station.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Station.findOne(mongoFilter.criteria);

    public createAsync = async (station: IStation): Promise<any> => await Station.create(station);

    public updateByIdAsync = async (id: string, station: IStation): Promise<any> => await Station.findOneAndUpdate({ _id: id }, { $set: station }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Station.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Station.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Station.countDocuments(mongoFilter.criteria);

}

export { StationRepository };