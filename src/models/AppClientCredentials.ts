import { Property, Required } from "@tsed/schema";

export class AppClientCredentials {

  @Property()
  @Required()
  clientId: string;

  @Property()
  @Required()
  clientSecret: string;

}