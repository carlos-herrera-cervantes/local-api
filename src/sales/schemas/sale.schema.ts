import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Position } from '../../positions/schemas/position.schema';
import { User } from '../../users/schemas/user.schema';
import { Customer } from '../../customers/schemas/customer.schema';
import { Station } from '../../stations/schemas/station.schema';
import { PaymentTransaction } from '../../paymentTransactions/schemas/paymentTransaction.schema';

export type SaleDocument = Sale & Document;

@Schema({ versionKey: false })
export class ProductSale {

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  quantity: number;

}

@Schema({ versionKey: false })
export class Sale {

  @Prop({ required: true, unique: true, default: 1 })
  consecutive: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Station' })
  station: Station;

  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ default: '200' })
  status: string;

  @Prop({ default: 0 })
  vat: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  tip: number;

  @Prop({ default: '' })
  totalLetters: string;

  @Prop({ default: false })
  sendToCloud: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PaymentTransaction' })
  paymentTransaction: PaymentTransaction;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Position' })
  position: Position;

  @Prop({ default: [] })
  products: ProductSale[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updateAt: Date;

}

export const SaleSchema = SchemaFactory.createForClass(Sale);