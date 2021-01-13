import { IMiddleware, Middleware, Req, Context } from '@tsed/common';
import { HttpException } from '../exceptions/HttpException';
import { verify } from 'jsonwebtoken';
import * as R from 'ramda';
import * as parameters from '../../parameters.json'

@Middleware()
export class AuthorizeMiddleware implements IMiddleware {

  /**
   * Verifiy the json web token
   * @param request Request object of Express
   * @param ctx Context in that's executed
   * @returns If the token is not valid, throws a bad request, otherwise passing to the next caller
   */
  use(@Req() request: Req, @Context() ctx: Context) {
    const authorization = R.pathOr('', ['authorization'], request.headers);
    const res = ctx.getResponse();

    if (R.isEmpty(authorization)) return new HttpException(res.__('MissingJsonWebToken'), 'MissingJsonWebToken', res).sendBadRequest();

    const isValidToken = verify(R.last(authorization.split(' ')) as string, parameters.jwt.secret);

    if (R.not(isValidToken)) return new HttpException(res.__('InvalidJsonWebToken'), 'InvalidJsonWebToken', res).sendBadRequest();
  }
}

