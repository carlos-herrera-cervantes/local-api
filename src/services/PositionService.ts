import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Position } from '../models/Position';
import { BaseService } from './BaseService';

@Service()
export class PositionService extends BaseService {

  constructor(@Inject(Position) private position: MongooseModel<Position>) {
    super(position);
  }

}