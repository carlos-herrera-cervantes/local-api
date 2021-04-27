import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ShiftDocument = Shift & Document;

@Schema({ versionKey: false })
export class Shift {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true, trim: true })
  startTime: string;

  @Prop({ required: true, trim: true })
  endTime: string;

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  monday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  tuesday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  wednesday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  thursday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  friday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  saturday: User[];

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  sunday: User[];

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;

}

export const ShiftSchema = SchemaFactory.createForClass(Shift);