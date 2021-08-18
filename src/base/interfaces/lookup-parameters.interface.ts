import { Model } from 'mongoose';
import { IMongoDBFilter } from '../entities/mongodb-filter.entity';

export interface IlookupParameters {
  model: Model<any>,
  filter: IMongoDBFilter,
  operation?: string,
  id?: string
}