'use strict';

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ResponseDto } from '../Models/Response';
import * as parameters from '../../parameters.json';

class Authorize {

  public async authenticateUser (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { headers: { authorization } } = request;

    if (!authorization) return ResponseDto.unauthorize(false, response, 'InvalidPermissions');

    const isValidToken = await verify(authorization.split(' ').pop(), parameters.jwt.secret);
    request.headers.userId = isValidToken.id;
    request.headers.role = isValidToken.role;

    if (isValidToken) return next();

    return ResponseDto.unauthorize(false, response, 'InvalidToken');
  }

}

const authorize = new Authorize();

export { authorize };