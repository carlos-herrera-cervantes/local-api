'use strict';

import { injectable } from 'inversify';
import { IRepository } from './IRepository';
import { IShift } from '../../Api.Domain/Models/IShift';
import { Shift } from '../../Api.Domain/Models/Shift';
import R from 'ramda';

@injectable()
class ShiftRepository implements IRepository<IShift> {

    public getAllAsync = async (mongoFilter: any): Promise<any> =>
        await Shift
            .find(R.pathOr({}, ['criteria'], mongoFilter))
            .skip(R.pathOr(0, ['pagination', 'page'], mongoFilter))
            .limit(R.pathOr(0, ['pagination', 'pageSize'], mongoFilter))
            .sort(R.pathOr({}, ['sort'], mongoFilter))

    public getByIdAsync = async (id: string, mongoFilter: any): Promise<any> => await Shift.findById(id);

    public getOneAsync = async (mongoFilter: any): Promise<any> => await Shift.findOne(mongoFilter.criteria);

    public createAsync = async (shift: IShift): Promise<any> => await Shift.create(shift);

    public updateByIdAsync = async (id: string, shift: IShift): Promise<any> => await Shift.findOneAndUpdate({ _id: id }, { $set: shift }, { new: true });

    public deleteByIdAsync = async (id: string): Promise<any> => await Shift.findOneAndDelete({ _id: id });

    public deleteManyAsync = async (mongoFilter: any): Promise<any> => await Shift.deleteMany(mongoFilter.criteria);

    public countAsync = async (mongoFilter: any): Promise<any> => await Shift.countDocuments(mongoFilter.criteria);

}

export { ShiftRepository };