'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IRepository } from './IRepository';
import { IPosition } from '../../Api.Domain/Models/IPosition';
import { Position } from '../../Api.Domain/Models/Position';

class PositionRepository implements IRepository<IPosition> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Position
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Position.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Position.findOne(mongoFilter.criteria);

    public createAsync = async (user: IPosition): Promise<any> => await Position.create(user);

    public updateByIdAsync = async (id: string, user: IPosition): Promise<any> => await Position.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Position.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Position.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Position.countDocuments(mongoFilter.criteria);

}

export { PositionRepository };