import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Station } from '../models/Station';
import { BaseService } from './BaseService';

@Service()
export class StationService extends BaseService {

  constructor(@Inject(Station) private station: MongooseModel<Station>) {
    super(station);
  }

}