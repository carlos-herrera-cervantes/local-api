import { Service } from '@tsed/common';
import { Shift } from '../models/Shift';
import * as R from 'ramda';
import '../extensions/ArrayExtensions';
import { setLocalDate, getLocalDate } from './DateCommon';

@Service()
export class ShiftCommon {

  /**
   * Returns the previous shift
   * @param {Array} shifts List of shifts
   * @returns {Shift} Shift object
   */
  getPrevious(shifts: Shift[]): Shift {
    const current = this.getCurrent(shifts);

    return shifts.selectOne((shift: Shift) => {
      if (R.equals(shift.order, current.order - 1)) {
        return shift;
      }
    });
  }

  /**
   * Returns the current shift
   * @param {Array} shifts List of shifts
   * @returns {Shift} Shift object
   */
  getCurrent(shifts: Shift[]): Shift {
    const { date: now } = getLocalDate();
    
    return shifts.selectOne((shift: Shift) => {
      const { start, end } = this.parseDate(shift);
      
      if (now > start && now < end) {
        return shift;
      }
    });
  }

  /**
   * If the calculated date is less than the current one, 1 day is added, otherwise 1 is subtracted
   * @param {Shift} shift Mongoose model
   * @param {Boolean} isPrevious True if is previous shift
   * @returns Object with start and end dates
   */
  parseDate(shift: Shift, isPrevious?: boolean): any {
    const [ { date: startTime }, { date: endTime }, { date: now } ] = [
      setLocalDate(shift.startTime),
      setLocalDate(shift.endTime),
      getLocalDate()
    ];

    const [ isAfter, isBefore ] = R.map(fn => fn(startTime, endTime, now), [this.isDayAfter, this.isDayBefore]);
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
      setLocalDate(shift.startTime),
      setLocalDate(shift.endTime),
      getLocalDate()
    ];

    const [ isAfter, isBefore ] = R.map(fn => fn(startTime, endTime, now), [this.isDayAfter, this.isDayBefore]);
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