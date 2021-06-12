import { Model } from 'mongoose';
import { IMongoDBFilter } from './entities/mongodb-filter.entity';

interface IlookupParameters {
  model: Model<any>,
  filter: IMongoDBFilter,
  operation?: string,
  id?: string
}

export class BaseService {
  constructor(private model: Model<any>) {}

  /**
   * Returns a list of all documents
   * @param {object} filter Object with fields to apply the filter
   * @returns List of documents
   */
  async getAllAsync(filter?: IMongoDBFilter): Promise<any> {
    return await this.lookup({ model: this.model, filter })
      ?.skip(filter?.page)
      ?.limit(filter?.pageSize)
      ?.sort(filter?.sort);
  }

  /**
   * Returns one document by its ID
   * @param {string} id document ID
   * @param {object} filter Object with fields to apply the filter
   * @returns Document
   */
  async getByIdAsync(id: string, filter?: IMongoDBFilter): Promise<any> {
    return await this.lookup({ model: this.model, filter, operation: 'findById', id });
  }

  /**
   * Returns one document by specific filter
   * @param {object} filter Object with specific fields to filter
   * @returns Document
   */
  async getOneAsync(filter?: IMongoDBFilter): Promise<any> {
    return await this.model.findOne(filter?.criteria).lean();
  }

  /**
   * Add new document
   * @param {object} doc Mongoose document
   * @returns Document
   */
  async createAsync(doc: any): Promise<any> {
    return await this.model.create(doc);
  }

  /**
   * Save the changes of document
   * @param {object} doc Object to save
   * @returns Document
   */
  async saveAsync(doc: any): Promise<any> {
    const instance = new this.model(doc);
    instance.isNew = false;
    return await instance.save();
  }

  /**
   * Updates a existing document
   * @param {string} id Document ID
   * @param {object} doc Document object to update
   * @returns Document
   */
  async updateOneByIdAsync(id: string, doc: any): Promise<any> {
    return await this.model.findOneAndUpdate({ _id: id }, { $set: doc }, { new: true });
  }

  /**
   * Deletes a existing document
   * @param {string} id Document ID
   * @returns Cursor
   */
  async deleteOneByIdAsync(id: string): Promise<any> {
    return await this.model.findOneAndDelete({ _id: id });
  }

  /**
   * Count total of documents by specific filter
   * @param {object} filter Object with specific fields to filter
   * @returns The total of documents
   */
  async coundDocsAsync(filter?: IMongoDBFilter): Promise<number> {
    return await this.model.countDocuments(filter?.criteria);
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
    const instance = operation == 'findById' ?
      model.findById(id)?.lean() :
      operation == 'findOne' ?
        model.findOne(filter?.criteria)?.lean() :
        model.find(filter?.criteria)?.lean();

    filter?.relation?.forEach((relation: string) => {
      const splited = relation.includes('.') ? relation.split('.') : relation;
      const filter = this.getStringQuery(splited);
      instance.populate(filter);
    });

    return instance;
  }

  /**
   * Returns the query string for populate process
   * @param {string | string[]} entities string or string array
   * @returns Query string
   */
   private getStringQuery(entities: any): any {
    switch (entities.length) {
      case 2: return {
        path: entities[0].includes('->') ? entities[0].replace('->', '.') : entities[0],
        populate: entities[1]
      };

      case 3: return {
        path: entities[0].includes('->') ? entities[0].replace('->', '.') : entities[0],
        populate: `${entities[1]} ${entities[2]}`
      };

      default: return entities.includes('->') ? entities.replace('->', '.') : entities;
    }
  }
}