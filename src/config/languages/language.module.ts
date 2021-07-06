import { Module, Global } from '@nestjs/common';
import { LanguageService } from './language.service';

@Global()
@Module({
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}