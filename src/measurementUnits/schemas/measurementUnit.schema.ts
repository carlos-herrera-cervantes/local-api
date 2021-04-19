import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeasurementUnitDocument = MeasurementUnit & Document;

@Schema({ versionKey: false })
export class MeasurementUnit {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  short: string;

  @Prop({ required: true })
  keySat: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const MeasurementUnitSchema = SchemaFactory.createForClass(MeasurementUnit);