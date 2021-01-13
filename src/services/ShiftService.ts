import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Shift } from '../models/Shift';
import { BaseService } from './BaseService';

@Service()
export class ShiftService extends BaseService {

  constructor(@Inject(Shift) private shift: MongooseModel<Shift>) {
    super(shift);
  }

}