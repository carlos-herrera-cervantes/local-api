import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationsService } from './stations.service';
import { Station, StationSchema } from './schemas/station.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }])],
  controllers: [],
  providers: [StationsService],
  exports: [StationsService]
})
export class StationsModule {}