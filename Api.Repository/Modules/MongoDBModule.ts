'use strict';

import { Model } from "mongoose";
import R from "ramda";

class MongoDBModule {

  public static buildFilter (model: Model<any>, mongoFilter: any, operation?: string, id?: string): any {
    const instance = R.equals(operation, 'findById') ?
      model.findById(id) :
      R.equals(operation, 'findOne') ?
      model.findOne(mongoFilter.criteria) :
      model.find(mongoFilter.criteria);

    R.pathOr([], ['relation'], mongoFilter).forEach(relation => {
      const splited = R.includes('.', relation) ? relation.split('.') : relation;
      const filter = this.getStringQuery(splited);
      instance.populate(filter);
    });

    return instance;
  }

  private static getStringQuery (entities: any): any {
    switch (entities.length) {
      case 2: return { path: R.includes('->', entities[0]) ? entities[0].replace('->', '.') : entities[0], populate: entities[1] };
      case 3: return { path: R.includes('->', entities[0]) ? entities[0].replace('->', '.') : entities[0], populate: `${entities[1]} ${entities[2]}` };
      default: return R.includes('->', entities) ? entities.replace('->', '.') : entities;
    }
  }

}

export { MongoDBModule };