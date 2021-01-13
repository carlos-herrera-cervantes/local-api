import { Property, Required, Default } from '@tsed/schema';
import { Model, Unique } from '@tsed/mongoose';
import { Genders } from '../constants/Genders';
import { Base } from './Base';

@Model()
export class Client extends Base {

  @Property()
  @Required()
  firstName: string;

  @Property()
  @Required()
  lastName: string;

  @Property()
  @Unique()
  @Required()
  email: string;

  @Property()
  @Default(Genders.No_Specified)
  gender: string = Genders.No_Specified;

}

/**
 * Transforms the B2C client to a local client model
 * @param response B2C response
 * @returns Client object model
 */
export function setDTOClientFromB2C (response: any) : Client {
  const client : Client = {
    _id: response?._id['$oid'],
    email: response?.email,
    firstName: response?.first_name,
    lastName: response?.last_name,
    gender: response?.gender,
    createdAt: response?.created_at,
    updatedAt: response?.updated_at
  };
  
  return client;
}