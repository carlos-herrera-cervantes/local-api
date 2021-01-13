import { Property, Required, Default } from '@tsed/schema';
import { Model } from '@tsed/mongoose';
import { Base } from './Base';

@Model()
export class Tax extends Base {

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  description: string;

  @Property()
  @Default(true)
  status: boolean = true;

  @Property()
  @Default(0)
  percentage: number = 0;

}