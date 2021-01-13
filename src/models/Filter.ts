import { Parameters } from '../models/Paramameters';

export class Filter {

  private sort: any;
  private page: number;
  private pageSize: number;
  private criteria: object;
  private relation: string[];

  constructor(private readonly queryParams: Parameters) { }

  /**
   * Set the properties to apply the sort
   * @returns Filter instance
   */
  setSort(): any {
    if (!('sort' in this.queryParams)) {
      this.sort = {};
      return this;
    }
    
    this.sort = JSON.parse(this.queryParams.sort);
    return this;
  }

  /**
   * Set the page and page size properties to the Filter instance
   * @returns Filter instance
   */
  setPagination(): any {
    if (!('page' in this.queryParams) && !('pageSize' in this.queryParams)) {
      this.page = 0;
      this.pageSize = 10;
      return this;
    }

    const { page, pageSize } = this.queryParams;
    const offset = page <= 1 ? 0 : page - 1;

    this.page = offset * pageSize;
    this.pageSize = pageSize > 100 ? 100 : pageSize;
    return this;
  }

  /**
   * Set the fields to apply the filter
   * @returns Filter instance
   */
  setCriteria(): any {
    if (Object.entries(this.queryParams).length == 0) {
      this.criteria = {};
      return this;
    }

    this.criteria = JSON.parse(this.queryParams.filter);
    return this;
  }

  /**
   * Set the references to other collections
   * @returns Filter instance
   */
  setRelation(): any {
    if ('relation' in this.queryParams) {
      this.relation = this.queryParams.relation.split(',');
      return this;
    }

    this.relation = [];
    return this;
  }

  /**
   * Returns an filter object for mongoose
   * @returns Filter object
   */
  build(): any {
    return {
      criteria: this.criteria,
      page: this.page,
      pageSize: this.pageSize,
      sort: this.sort,
      relation: this.relation
    };
  }

}