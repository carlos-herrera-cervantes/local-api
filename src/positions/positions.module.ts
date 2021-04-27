import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { Position, PositionSchema } from './schemas/position.schema';
import { SalesModule } from '../sales/sales.module';
import { AuthModule } from '../auth/auth.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { DatesModule } from '../dates/dates.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }]),
    SalesModule,
    AuthModule,
    DatesModule,
    ShiftsModule,
    CustomersModule
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
  exports: [PositionsService]
})
export class PositionsModule {}