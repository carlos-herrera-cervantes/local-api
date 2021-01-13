import { Property, Required } from "@tsed/schema";

export class Credentials {

    @Property()
    @Required()
    email: string;

    @Property()
    @Required()
    password: string;

}