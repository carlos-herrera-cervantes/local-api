import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethod } from '../../paymentMethods/schemas/paymentMethod.schema';

export type PaymentTransactionDocument = PaymentTransaction & Document;

@Schema({ versionKey: false })
class Metadata {

  @Prop()
  brandCard: string;

  @Prop()
  cardNumbers: string;

  @Prop()
  transactionAt: Date;

  @Prop()
  description: string;

  @Prop()
  approvalCode: string;

  @Prop()
  issuingBank: string;

}

@Schema({ versionKey: false })
export class PaymentTransaction {

  @Prop({ default: 2 })
  status: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop()
  metadata: Metadata;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethod: PaymentMethod;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);