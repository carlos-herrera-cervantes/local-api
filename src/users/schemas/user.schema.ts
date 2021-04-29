import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../base/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  cardMoneyAmount: number;

  @Prop({ default: 0 })
  cashMoneyAmount: number;

  @Prop({ default: [ Role.Employee ] })
  roles: Role[];

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);