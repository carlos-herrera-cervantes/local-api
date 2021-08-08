import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ShiftsService } from '../shifts/shifts.service';
import { CreateShiftDto } from '../shifts/dto/create-shift.dto';
import shifts from '../scripts/shifts.json';

@Injectable()
export class LoaderShifts implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(LoaderShifts.name);

  constructor(
    private readonly shiftsService: ShiftsService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') == 'test') return;

    const totalShifts = await this.shiftsService.countDocsAsync();

    if (totalShifts > 0) {
      this.logger.log({
        datetime: new Date(),
        appId: '',
        event: 'seed_shifts_success',
        level: 'INFO',
        description: 'The basic shifts have already been created'
      });

      return;
    }

    await this.shiftsService.createManyAsync(shifts as CreateShiftDto[]).catch(err => this.logger.error({
      datetime: new Date(),
      appId: '',
      event: 'seed_shifts_fail',
      level: 'ERROR',
      description: 'Something went wrong trying to create the basic shifts: ' + err?.message
    }));

    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'seed_shifts_success',
      level: 'INFO',
      description: 'The basic shifts have been created successfully'
    });
  }

}