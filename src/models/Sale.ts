import { Property, Required, Default, CollectionOf } from '@tsed/schema';
import { Model, Unique, Ref, Schema } from '@tsed/mongoose';
import { PaymentTransaction } from '../models/PaymentTransaction';
import { Position } from '../models/Position';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Client } from '../models/Client';
import { Station } from './Station';
import { Base } from './Base';

@Schema()
export class ProductSale {

  @Property()
  @Required()
  @Ref(Product)
  product: Ref<Product>;

  @Property()
  @Required()
  quantity: number;

}

@Model()
export class Sale extends Base {

  @Property()
  @Required()
  @Unique()
  @Default(1)
  consecutive: number = 1;

  @Property()
  @Required()
  @Ref(Station)
  station: Ref<Station>;

  @Property()
  @Unique()
  @Required()
  folio: string;

  @Property()
  @Default('200')
  status: string = '200';

  @Property()
  @Default(0)
  iva: number = 0;

  @Property()
  @Default(0)
  subtotal: number = 0;

  @Property()
  @Default(0)
  total: number = 0;

  @Property()
  @Default(0)
  tip: number = 0;

  @Property()
  @Default('')
  totalLetters: string = '';

  @Property()
  @Default(false)
  sendToCloud: boolean = false;

  @Property()
  @Ref(PaymentTransaction)
  paymentTransaction: Ref<PaymentTransaction>;

  @Property()
  @Required()
  @Ref(Position)
  position: Ref<Position>;

  @Property()
  @Default([])
  @CollectionOf(ProductSale)
  products: ProductSale[] = [];

  @Property()
  @Ref(User)
  user: Ref<User>;

  @Property()
  @Required()
  @Ref(Client)
  client: Ref<Client>;

}