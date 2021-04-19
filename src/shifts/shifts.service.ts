import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shift, ShiftDocument } from './schemas/shift.schema';
import { BaseService } from '../base/base.service';
import { DateService } from '../dates/dates.service';

@Injectable()
export class ShiftsService extends BaseService {
  
  constructor(
    @InjectModel(Shift.name)
    private shiftModel: Model<ShiftDocument>,
    private datesService: DateService
  ) {
    super(shiftModel);
  }

  /**
   * Returns the previous shift
   * @param {Array} shifts List of shifts
   * @returns {Shift} Shift object
   */
   getPrevious(shifts: Shift[], localDate: any): Shift {
    const current = this.getCurrent(shifts, localDate);
    return shifts.filter((shift: Shift) => shift.order == current.order - 1).pop();
  }

  /**
   * Returns the current shift
   * @param {Array} shifts List of shifts
   * @returns {Shift} Shift object
   */
   getCurrent(shifts: Shift[], localDate: any): Shift {
    const { date: now } = localDate;
    
    return shifts.filter((shift: Shift) => {
      const { start, end } = this.parseDate(shift);

      if (now > start && now < end) {
        return shift;
      }
    })
    .pop();
  }

  /**
   * If the calculated date is less than the current one, 1 day is added, otherwise 1 is subtracted
   * @param {Shift} shift Mongoose model
   * @param {Boolean} isPrevious True if is previous shift
   * @returns Object with start and end dates
   */
   parseDate(shift: Shift, isPrevious?: boolean): any {
    const [ { date: startTime }, { date: endTime }, { date: now } ] = [
      this.datesService.setLocalDate(shift.startTime),
      this.datesService.setLocalDate(shift.endTime),
      this.datesService.getLocalDate()
    ];

    const [isAfter, isBefore] = [this.isDayAfter, this.isDayBefore].map(fn => fn(startTime, endTime, now));
    const result = { start: startTime, end: endTime };

    if (isBefore) result.end = new Date(endTime.getTime() + 86400000);

    if (isAfter) result.start = new Date(startTime.getTime() - 86400000);

    return result;
  }

  /**
   * If the calculated date is less than the current one, 1 day is added, otherwise 1 is subtracted
   * @param {Shift} shift Mongoose model
   * @param {Boolean} isPrevious True if is previous shift
   * @returns Object with start and end dates
   */
   parseDateUTC(shift: Shift, isPrevious?: boolean): any {
    const [ { date: startTime }, { date: endTime }, { date: now } ] = [
      this.datesService.setLocalDate(shift.startTime),
      this.datesService.setLocalDate(shift.endTime),
      this.datesService.getLocalDate()
    ];

    const [_, isBefore] = [this.isDayAfter, this.isDayBefore].map(fn => fn(startTime, endTime, now));
    const result = { start: startTime, end: endTime };

    if (isBefore) result.end = new Date(now.getTime() + 86400000);

    return result;
  }

  /**
   * Checks if the date is before to the current day
   * @param {Date} start Start date
   * @param {Date} end End date
   * @param {Date} now Current date
   * @returns True if the date is before to the current day
   */
   private isDayBefore(start: Date, end: Date, now: Date): boolean {
    return end < start && end < now;
  }

  /**
   * Checks if the date is after to the current day
   * @param {Date} start Start date
   * @param {Date} end End date
   * @param {Date} now Current date
   * @returns True if the date is after to the current day
   */
   private isDayAfter(start: Date, end: Date, now: Date): boolean {
    return end < start && now > start;
  }

}