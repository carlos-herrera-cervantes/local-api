import { Parameters } from './Paramameters';

export class Paginator<T> {

  /**
   * Initializes a new Paginator instance
   * @param {MongooseModel} data Documents of collection
   * @param {Parameters} queryParams Parameters object model
   * @param {Number} totalDocuments Total documents of collection
   */
  constructor(private data: T[], private queryParams: Parameters, private totalDocuments: number) {}

  /**
   * Creates the pagination object
   * @returns Pagination object
   */
  pager(): any {
    const { page, pageSize } = this.queryParams;
    const take = page * pageSize;

    const paginator = {
      page: page < 1 ? 1 : page,
      pageSize: pageSize < 1 ? 10 : pageSize > 100 ? 100 : pageSize,
      remainingDocuments: (this.totalDocuments - take) <= 0 ? 0 : this.totalDocuments - take,
      totalDocuments: this.totalDocuments
    };

    return { docs: this.data, paginator };
  }

}