import { Property, Required, Default } from '@tsed/schema';
import { Model, Unique } from '@tsed/mongoose';
import { Base } from './Base';

@Model()
export class Station extends Base {

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  @Unique()
  stationKey: string;

  @Property()
  @Default(true)
  active: boolean = true;

  @Property()
  @Default('')
  street: string = '';

  @Property()
  @Default('')
  outside: string = '';

  @Property()
  @Default('')
  zipCode: string = '';

  @Property()
  @Default('')
  state: string = '';

  @Property()
  @Default('')
  municipality: string = '';

}