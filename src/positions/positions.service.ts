import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Position, PositionDocument } from './schemas/position.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class PositionsService extends BaseService {
  
  constructor(@InjectModel(Position.name) private positionModel: Model<PositionDocument>) {
    super(positionModel);
  }

}