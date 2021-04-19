import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Station, StationDocument } from './schemas/station.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class StationsService extends BaseService {
  
  constructor(@InjectModel(Station.name) private stationModel: Model<StationDocument>) {
    super(stationModel);
  }

}