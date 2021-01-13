import { MongooseModel } from "@tsed/mongoose";
import { Model } from 'mongoose';
import * as R from 'ramda';

interface IlookupParameters {
  model: Model<any>,
  filter: any,
  operation?: string,
  id?: string
}

export class BaseService {

  constructor(protected repository: MongooseModel<any>) {}

  /**
   * Returns a list of all documents
   * @param {Object} filter Object with fields to apply the filter
   * @returns List of documents
   */
  async getAllAsync(filter?: any): Promise<any[]> {
    return await this.repository
      .find(R.pathOr({}, ['criteria'], filter))
      .skip(R.pathOr(0, ['page'], filter))
      .limit(R.pathOr(0, ['pageSize'], filter))
      .sort(R.pathOr({}, ['sort'], filter));
  }

  /**
   * Returns one document by its ID
   * @param id document ID
   * @param {Object} filter Object with fields to apply the filter
   * @returns Document
   */
  async getByIdAsync(id: string, filter?: any): Promise<any> {
    return await this.repository.findOne({ _id: id });
  }

  /**
   * Returns one document by specific filter
   * @param criteria Object with specific fields to filter
   * @returns Document
   */
   async getOneAsync(criteria: object): Promise<any> {
    return await this.repository.findOne(criteria);
  }

  /**
   * Add new document
   * @param doc Mongoose document
   * @returns Document
   */
   async createAsync(doc: any): Promise<any> {
    return await this.repository.create(doc);
  }

  /**
   * Save the changes of document
   * @param doc Object to save
   * @returns Document
   */
   async saveAsync(doc: any): Promise<any> {
    const saved = new this.repository(doc);
    return saved.save();
  }

  /**
   * Updates a existing document
   * @param id Document ID
   * @param doc Document object to update
   * @returns Document
   */
   async updateOneByIdAsync(id: string, doc: any): Promise<any> {
    return await this.repository.findOneAndUpdate({ _id: id }, { $set: doc }, { new: true });
  }

  /**
   * Deletes a existing document
   * @param id Document ID
   * @returns Cursor
   */
   async deleteOneByIdAsync(id: string): Promise<any> {
    return await this.repository.findOneAndDelete({ _id: id });
  }

  /**
   * Count total of documents by specific filter
   * @param filter Object with specific fields to filter
   * @returns The total of documents
   */
   async countDocuments(filter?: any): Promise<number> {
    return await this.repository.countDocuments(R.pathOr({}, ['criteria'], filter));
  }

  /**
   * Returns the model with populated references
   * @param model Mongoose model
   * @param filter Object with fields to apply the filter
   * @param operation Operation name
   * @param id Object ID
   * @returns Operation hook
   */
   private lookup({ model, filter, operation, id }: IlookupParameters): any {
    const instance = R.equals(operation, 'findById') ?
      model.findById(id) :
      R.equals(operation, 'findOne') ?
        model.findOne(R.pathOr({}, ['criteria'], filter)) :
        model.find(R.pathOr({}, ['criteria'], filter));

    R.pathOr([], ['relation'], filter).forEach((relation: string) => {
      const splited = R.includes('.', relation) ? relation.split('.') : relation;
      const filter = this.getStringQuery(splited);
      instance.populate(filter);
    });

    return instance;
  }

  /**
   * Returns the query string for populate process
   * @param entities string or string array
   * @returns Query string
   */
  private getStringQuery(entities: any): any {
    switch (entities.length) {
      case 2: return {
        path: R.includes('->', R.head(entities)) ? R.head(entities).replace('->', '.') : R.head(entities),
        populate: entities[1]
      };

      case 3: return {
        path: R.includes('->', R.head(entities)) ? R.head(entities).replace('->', '.') : R.head(entities),
        populate: `${entities[1]} ${entities[2]}`
      };

      default: return R.includes('->', entities) ? entities.replace('->', '.') : entities;
    }
  }

}