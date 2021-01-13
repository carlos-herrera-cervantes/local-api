import { Property, Required, Default } from '@tsed/schema';
import { Model, Ref } from '@tsed/mongoose';
import { User } from '../models/User';
import { Base } from './Base';

@Model()
export class CollectMoney extends Base {

  @Property()
  @Required()
  @Ref(User)
  user: Ref<User>;

  @Property()
  @Default(0)
  @Required()
  amount: number = 0;

  @Property()
  @Default('cash')
  @Required()
  type: string = 'cash';

}