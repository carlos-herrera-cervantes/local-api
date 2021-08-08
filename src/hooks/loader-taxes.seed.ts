import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TaxesService } from '../taxes/taxes.service';
import { CreateTaxDto } from '../taxes/dto/create-tax.dto';
import taxes from '../scripts/taxes.json';

@Injectable()
export class LoaderTaxes implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(LoaderTaxes.name);

  constructor(
    private readonly taxesService: TaxesService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') == 'test') return;

    const totalTaxes = await this.taxesService.countDocsAsync();

    if (totalTaxes > 0) {
      this.logger.log({
        datetime: new Date(),
        appId: '',
        event: 'seed_taxes_success',
        level: 'INFO',
        description: 'The taxes have already been created'
      });

      return;
    }

    await this.taxesService.createManyAsync(taxes as CreateTaxDto[]).catch(err => this.logger.error({
      datetime: new Date(),
      appId: '',
      event: 'seed_taxes_fail',
      level: 'ERROR',
      description: 'Something went wrong trying to create the taxes: ' + err?.message
    }));

    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'seed_taxes_success',
      level: 'INFO',
      description: 'The taxes have been created successfully'
    });
  }

}