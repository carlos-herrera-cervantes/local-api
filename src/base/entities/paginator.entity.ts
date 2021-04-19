import { QueryParams } from './query-params.entity';

interface IPaginator {
  page: number,
  pageSize: number,
  remainingDocuments: number,
  totalDocuments: number
}

export interface IPaginatorData<T> {
  data: T[],
  paginator: IPaginator
}

export class Paginator<T> {

  /**
   * Initializes a new Paginator instance
   * @param {MongooseModel} data Documents of collection
   * @param {QueryParams} queryParams Parameters object model
   * @param {Number} totalDocuments Total documents of collection
   */
  constructor(private data: T[], private queryParams: QueryParams, private totalDocuments: number) {}

  /**
   * Creates the pagination object
   * @returns Pagination object
   */
  getPaginator(): IPaginatorData<T> {
    const { page, pageSize } = this.queryParams;
    const take = page * pageSize;

    return {
      data: this.data,
      paginator: {
        page: page < 1 ? 1 : page,
        pageSize: pageSize < 1 ? 10 : pageSize > 100 ? 100 : pageSize,
        remainingDocuments: (this.totalDocuments - take) <= 0 ? 0 : this.totalDocuments - take,
        totalDocuments: this.totalDocuments
      }
    };
  }

}