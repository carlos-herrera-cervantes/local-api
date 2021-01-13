import { Property, Required, Default } from '@tsed/schema';
import { Model, Trim, Ref } from '@tsed/mongoose';
import { User } from './User';
import { Base } from './Base';

@Model()
export class Shift extends Base {

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  order: number;

  @Trim()
  @Required()
  startTime: string;

  @Trim()
  @Required()
  endTime: string;

  @Property()
  @Default([])
  @Ref(User)
  monday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  tuesday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  wednesday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  thursday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  friday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  saturday: Ref<User>[] = [];

  @Property()
  @Default([])
  @Ref(User)
  sunday: Ref<User>[] = [];

}