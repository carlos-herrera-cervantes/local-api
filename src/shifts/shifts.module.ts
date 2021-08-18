import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { Shift, ShiftSchema } from './schemas/shift.schema';
import { DatesModule } from '../dates/dates.module';
import { CollectsModule } from '../collects/collects.module';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }]),
    DatesModule,
    CollectsModule,
    forwardRef(() => SalesModule)
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService]
})
export class ShiftsModule {}