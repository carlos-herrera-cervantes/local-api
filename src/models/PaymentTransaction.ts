import { Property, Default } from '@tsed/schema';
import { Model, Ref } from '@tsed/mongoose';
import { PaymentMethod } from '../models/PaymentMethod';
import { Base } from './Base';

@Model()
export class PaymentTransaction extends Base {

  @Property()
  @Default(2)
  status: number = 2;

  @Property()
  @Default(0)
  quantity: number = 0;

  @Property()
  @Default({})
  metadata: any = {};

  @Property()
  @Ref(PaymentMethod)
  paymentMethod: Ref<PaymentMethod>;

}