import { Request, Response, NextFunction } from 'express';
import * as i18n from 'i18n';
import path from 'path';

export function setLanguage(req: Request, res: Response, next: NextFunction) {
  i18n.configure({ directory: path.join(__dirname, '..', '..', 'locales'), defaultLocale: 'es' });
  i18n.init(req, res);
  next();
}