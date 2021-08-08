import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { MeasurementUnit, MeasurementUnitSchema } from './schemas/measurementUnit.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MeasurementUnit.name, schema: MeasurementUnitSchema }])],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
  exports: [MeasurementsService]
})
export class MeasurementsModule {}