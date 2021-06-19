import { Injectable } from '@nestjs/common';
import * as i18n from 'i18n';

@Injectable()
export class LanguageService {
  private readonly defaultLocale: string;

  constructor() {
    i18n.configure({
      defaultLocale: 'es',
      directory: `${process.cwd()}/src/config/languages`,
    });

    this.defaultLocale = 'es';
  }
}