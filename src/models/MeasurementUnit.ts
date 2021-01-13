import { Property, Required } from '@tsed/schema';
import { Model } from '@tsed/mongoose';
import { Base } from './Base';

@Model()
export class MeasurementUnit extends Base {

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  short: string;

  @Property()
  @Required()
  keySat: string;

}