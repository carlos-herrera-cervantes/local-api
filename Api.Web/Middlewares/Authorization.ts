'use strict';

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ResponseDto } from '../Models/Response';

class Authorize {

  public async authenticateUser (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { headers: { authorization } } = request;

    if (!authorization) {
      return ResponseDto.unauthorize(false, response, 'InvalidPermissions');
    }

    const isValidToken = await verify(authorization.split(' ').pop(), process.env.SECRET_KEY);
    request.headers.userId = isValidToken.id;

    if (isValidToken) {
      return next();
    }

    return ResponseDto.unauthorize(false, response, 'InvalidToken');
  }

}

const authorize = new Authorize();

export { authorize };