import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { ShiftsService } from '../shifts.service';

@Injectable()
export class ExistsShiftGuard implements CanActivate {

  constructor(private shiftsService: ShiftsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const shift = await this.shiftsService.getByIdAsync(params?.id);

    if (!shift) throw new HttpException('Shift not found', HttpStatus.NOT_FOUND);

    return true;
  }

}