import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PositionsService } from '../positions/positions.service';
import { CreatePositionDto } from '../positions/dto/create-position.dto';
import positions from '../scripts/positions.json';

@Injectable()
export class LoaderPositions implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(LoaderPositions.name);

  constructor(
    private readonly positionsService: PositionsService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') == 'test') return;

    const totalPositions = await this.positionsService.countDocsAsync();

    if (totalPositions > 0) {
      this.logger.log({
        datetime: new Date(),
        appId: '',
        event: 'seed_positions_success',
        level: 'INFO',
        description: 'The positions have already been created'
      });

      return;
    }

    await this.positionsService.createManyAsync(positions as CreatePositionDto[]).catch(err => this.logger.error({
      datetime: new Date(),
      appId: '',
      event: 'seed_positions_fail',
      level: 'ERROR',
      description: 'Something went wrong trying to create the basic positions: ' + err?.message
    }));

    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'seed_positions_success',
      level: 'INFO',
      description: 'The positions have been created successfully'
    });
  }

}