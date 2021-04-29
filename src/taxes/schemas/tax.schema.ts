import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaxDocument = Tax & Document;

@Schema({ versionKey: false })
export class Tax {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: 0 })
  percentage: number;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;

}

export const TaxSchema = SchemaFactory.createForClass(Tax);