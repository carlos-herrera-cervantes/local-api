import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MeasurementUnit, MeasurementUnitDocument } from './schemas/measurementUnit.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class MeasurementsService extends BaseService {
  
  constructor(@InjectModel(MeasurementUnit.name) private measurementModel: Model<MeasurementUnitDocument>) {
    super(measurementModel);
  }

}