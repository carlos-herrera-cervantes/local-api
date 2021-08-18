import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { ShiftsService } from '../shifts.service';
import { DateService } from '../../dates/dates.service';
import dayjs from 'dayjs';

@Injectable()
export class AssignShiftGuard implements CanActivate {

  constructor(
    private shiftsService: ShiftsService,
    private dateService: DateService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (user?.roles.includes('SuperAdmin')) return true;

    const shifts = await this.shiftsService.getAllAsync();
    const localDate = this.dateService.getLocalDate();
    const current = await this.shiftsService.getCurrent(shifts, localDate);

    if (!current) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const weekDay = dayjs().format('dddd');
    const weekDayShift = current[weekDay.toLowerCase()];
    const isAssignUser = weekDayShift.find((id: string) => id == user?.sub);

    if (!isAssignUser) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return true;
  }

}