import { Product } from './Product';
import { Tax } from './Tax';
import { MeasurementUnit } from './MeasurementUnit';

interface IProductProjectionBase {
  _id: string,
  name: string,
  description: string,
  price: number,
  pricePublic: number,
  taxes: Tax[],
  measurementUnit: MeasurementUnit;
}

export interface IProductProjection {
  product: IProductProjectionBase,
  quantity: number
}