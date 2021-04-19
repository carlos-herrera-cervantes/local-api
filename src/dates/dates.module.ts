import { Module } from '@nestjs/common';
import { DateService } from './dates.service';

@Module({
  providers: [DateService],
  exports: [DateService]
})
export class DatesModule {}