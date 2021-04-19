import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from '../../base/enums/gender.enum';

export type CustomerDocument = Customer & Document;

@Schema({ versionKey: false })
export class Customer {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: Gender.Not_Specified, enum: Gender })
  gender: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);