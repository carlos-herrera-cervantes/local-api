import { IMiddleware, Middleware, Req } from '@tsed/common';
import * as R from 'ramda';

@Middleware()
export class UpdateDateMiddleware implements IMiddleware {

  /**
   * Set the date for updatedAt field for model
   * @param req Object request of express
   * @returns Next call in the stack trace
   */
  use(@Req() req: Req) {
    if (R.equals(req.method, 'PATCH')) {
      req.body.updatedAt = new Date();
    }
  }
}