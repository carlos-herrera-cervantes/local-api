import { Property, Required, Default } from '@tsed/schema';
import { Model, Unique } from '@tsed/mongoose';
import { Base } from './Base';

@Model()
export class PaymentMethod extends Base {

  @Property()
  @Unique()
  @Required()
  key: string;

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  description: string;

  @Property()
  @Default(true)
  status: boolean = true;

}