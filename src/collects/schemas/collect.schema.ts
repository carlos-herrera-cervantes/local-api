import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TypeCollect } from '../../base/enums/type-collect.enum';
import { User } from '../../users/schemas/user.schema';

export type CollectMoneyDocument = CollectMoney & Document;

@Schema({ versionKey: false })
export class CollectMoney {

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true, default: TypeCollect.Cash, enum: TypeCollect })
  type: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const CollectMoneySchema = SchemaFactory.createForClass(CollectMoney);