import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PositionDocument = Position & Document;

@Schema({ versionKey: false })
export class Position {

  @Prop({ default: '200' })
  status: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;

}

export const PositionSchema = SchemaFactory.createForClass(Position);