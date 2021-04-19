import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StationDocument = Station & Document;

@Schema({ versionKey: false })
export class Station {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email:string;

  @Prop({ required: true, unique: true })
  stationKey: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: '' })
  street: string;

  @Prop({ default: '' })
  outside: string;

  @Prop({ default: '' })
  zipCode: string;

  @Prop({ default: '' })
  state: string;

  @Prop({ default: '' })
  municipality: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const StationSchema = SchemaFactory.createForClass(Station);