import { ObjectID } from '@tsed/mongoose';
import { Property, Default, Format } from '@tsed/schema';

export class Base {
  @ObjectID()
  _id: string;

  @Property()
  @Format('date-time')
  @Default(Date.now)
  createdAt: Date = new Date();

  @Property()
  @Format('date-time')
  @Default(Date.now)
  updatedAt: Date = new Date();
}