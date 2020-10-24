'use strict';

import { ObjectID } from 'mongodb';

class CollectionEventReceived {

  public model: any;

  constructor (model: any) {
    this.model = model;
  }

}

export { CollectionEventReceived };