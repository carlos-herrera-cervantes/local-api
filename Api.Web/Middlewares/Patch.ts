'use strict';

import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

class Patch {

  public updateDate (request: Request, response: Response, next: NextFunction): any {
    const { body } = request;
    body.updatedAt = moment().utc().format('YYYY-MM-DDTHH:mm:ss');

    next();
  }

}

const patch = new Patch();

export { patch };