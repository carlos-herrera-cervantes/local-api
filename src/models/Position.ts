import { Property, Required, Default } from '@tsed/schema';
import { Model, Unique } from '@tsed/mongoose';
import { Base } from './Base';

@Model()
export class Position extends Base {

  @Property()
  @Default('200')
  status: string = '200';

  @Property()
  @Required()
  name: string;

  @Property()
  @Unique()
  @Default(1)
  number: number = 1;

}