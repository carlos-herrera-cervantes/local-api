import { Property, Required, Default } from '@tsed/schema';
import { Model, Ref } from '@tsed/mongoose';
import { Tax } from '../models/Tax';
import { MeasurementUnit } from '../models/MeasurementUnit';
import { Base } from './Base';

@Model()
export class Product extends Base {

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  description: string;

  @Property()
  @Default(0)
  price: number = 0;

  @Property()
  @Default(0)
  pricePublic: number = 0;

  @Property()
  @Default([])
  @Ref(Tax)
  taxes: Ref<Tax>[] = [];

  @Property()
  @Ref(MeasurementUnit)
  measurementUnit: Ref<MeasurementUnit>;

}