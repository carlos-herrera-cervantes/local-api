import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { MeasurementUnit } from '../models/MeasurementUnit';
import { BaseService } from './BaseService';

@Service()
export class MeasurementUnitService extends BaseService {

  constructor(@Inject(MeasurementUnit) private measurementUnit: MongooseModel<MeasurementUnit>) {
    super(measurementUnit);
  }

}