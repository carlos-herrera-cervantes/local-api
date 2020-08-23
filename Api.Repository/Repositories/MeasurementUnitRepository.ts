'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IMeasurementUnit } from '../../Api.Domain/Models/IMeasurementUnit';
import { MeasurementUnit } from '../../Api.Domain/Models/MeasurementUnit';

@injectable()
class MeasurementUnitRepository implements IRepository<IMeasurementUnit> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await MeasurementUnit
            .find(mongoFilter.criteria)
            .skip(mongoFilter.pagination.page)
            .limit(mongoFilter.pagination.pageSize)
            .sort(mongoFilter.sort);

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await MeasurementUnit.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await MeasurementUnit.findOne(mongoFilter.criteria);

    public createAsync = async (measurementUnit: IMeasurementUnit): Promise<any> => await MeasurementUnit.create(measurementUnit);

    public updateByIdAsync = async (id: string, measurementUnit: IMeasurementUnit): Promise<any> => await MeasurementUnit.findOneAndUpdate({ _id: id }, { $set: measurementUnit }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await MeasurementUnit.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await MeasurementUnit.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await MeasurementUnit.countDocuments(mongoFilter.criteria);

}

export { MeasurementUnitRepository };