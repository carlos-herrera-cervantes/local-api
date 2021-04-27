import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MeasurementUnit } from '../../measurementUnits/schemas/measurementUnit.schema';
import { Tax } from '../../taxes/schemas/tax.schema';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false })
export class Product {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  pricePublic: number;

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tax' }] })
  taxes: Tax[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MeasurementUnit' })
  measurementUnit: MeasurementUnit;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;

}

export const ProductSchema = SchemaFactory.createForClass(Product);