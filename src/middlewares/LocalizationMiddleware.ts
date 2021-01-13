import { Middleware, Context } from '@tsed/common';
import i18n from  'i18n';
import path from 'path';

@Middleware()
export class LocalizationMiddleware {

  /**
   * Injects the language to correspond with the accept language header
   * @param ctx Context in that's executed
   * @returns Language keys
   */
  use(@Context() ctx: Context) {
    i18n.configure({ directory: path.join(__dirname, '..', 'locales'), defaultLocale: 'en' });
    i18n.init(ctx.getRequest(), ctx.getResponse());
  }
}