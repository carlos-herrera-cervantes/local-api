import { Err, Middleware, $log, Context } from '@tsed/common';
import { HttpException } from '../exceptions/HttpException';

@Middleware()
export class ErrorMiddleware {

  /**
   * Catch any error in the stack and returns an internal server error
   * @param err
   * @returns Internal Server Error
   */
  use(@Err() err: unknown, @Context() ctx: Context) {
    $log.error('ERROR: ', err);
    const res = ctx.getResponse();
    return new HttpException(err as string, '', res).sendInternalServerError();
  }
}