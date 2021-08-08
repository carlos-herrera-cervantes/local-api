import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MeasurementsService } from '../measurementUnits/measurements.service';
import { CreateMeasurementDto } from '../measurementUnits/dto/create-measurement.dto';
import measurements from '../scripts/measurement-units.json';

@Injectable()
export class LoaderMeasurements implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(LoaderMeasurements.name);

  constructor(
    private readonly measurementsService: MeasurementsService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') == 'test') return;

    const totalDocs = await this.measurementsService.countDocsAsync();

    if (totalDocs > 0) {
      this.logger.log({
        datetime: new Date(),
        appId: '',
        event: 'seed_measurements_success',
        level: 'INFO',
        description: 'The measurements have already been created'
      });

      return;
    }

    await this.measurementsService.createManyAsync(measurements as CreateMeasurementDto[])
      .catch(err => this.logger.error({
        datetime: new Date(),
        appId: '',
        event: 'seed_measurements_fail',
        level: 'ERROR',
        description: 'Something went wrong trying to create the measurements: ' + err?.message
      }));

    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'seed_measurements_success',
      level: 'INFO',
      description: 'The measurements have been created successfully'
    });
  }
}