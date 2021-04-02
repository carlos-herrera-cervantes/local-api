import { Property, Required, Default, Enum } from '@tsed/schema';
import { Model, Unique } from '@tsed/mongoose';
import { AppClientType } from '../constants/AppClientType';
import { Roles } from '../constants/Roles';
import { Base } from './Base';

@Model()
export class AppClient extends Base {

  @Property()
  @Unique()
  @Required()
  clientId: string;

  @Property()
  @Unique()
  @Required()
  clientSecret: string;

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  @Enum(AppClientType)
  @Default(AppClientType.App)
  type: string = AppClientType.App;

  @Property()
  @Required()
  @Enum(Roles)
  @Default(Roles.AppClientAdmin)
  role: string = Roles.AppClientAdmin;

}