import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { MeasurementsService } from '../measurements.service';

@Injectable()
export class ExistsMeasurementGuard implements CanActivate {

  constructor(private measurementsService: MeasurementsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const measurement = await this.measurementsService.getByIdAsync(params?.id);

    if (!measurement) throw new HttpException('Measurement not found', HttpStatus.NOT_FOUND);

    return true;
  }

}