import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { ShiftsService } from '../shifts.service';
import { DateService } from '../../dates/dates.service';
import dayjs from 'dayjs';

@Injectable()
export class AssignShiftGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private shiftsService: ShiftsService,
    private dateService: DateService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest();
    const token = headers?.authorization?.split(' ').pop();
    const { sub, roles } = await this.authService.getPayload(token);

    if (roles.includes('SuperAdmin')) return true;

    const shifts = await this.shiftsService.getAllAsync();
    const localDate = this.dateService.getLocalDate();
    const current = await this.shiftsService.getCurrent(shifts, localDate);

    if (!current) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const weekDay = dayjs().format('dddd');
    const weekDayShift = current[weekDay.toLowerCase()];
    const isAssignUser = weekDayShift.find((user: string) => user == sub);

    if (!isAssignUser) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return true;
  }

}