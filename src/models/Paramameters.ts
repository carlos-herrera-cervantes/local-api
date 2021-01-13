import { Property } from '@tsed/schema';

export class Parameters {
  @Property()
  page: number = 1;

  @Property()
  pageSize: number = 10;

  @Property()
  sort: string = '{}';

  @Property()
  filter: string = '{}';

  @Property()
  relation: string;
}