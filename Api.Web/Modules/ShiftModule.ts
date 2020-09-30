'use strict';

import { IShift } from "../../Api.Domain/Models/IShift";
import moment from "moment-timezone";
import R from "ramda";
import '../Extensions/ArrayExtensions';

class ShiftModule {

  public static getPrevious = (shifts: Array<IShift>): IShift => {
    const current = ShiftModule.getCurrent(shifts);
    return shifts.selectOne(shift => {
      if (R.equals(shift.order, current.order - 1)) return shift;
    });
  }

  public static getCurrent = (shifts: Array<IShift>): IShift => {
    const now = moment(moment.tz(process.env.TIME_ZONE).format('YYYY-MM-DD HH:mm:ss'));
    return shifts.selectOne(shift => {
      const { start, end } = ShiftModule.getDate(shift);
      if (now.isBetween(start, end)) return shift;
    });
  }

  public static getDate = (shift: IShift, isPrevious?: boolean): any => {
    const [ date, hour ] = R.map(fn => fn(false), [ShiftModule.getCurrentDate, ShiftModule.getCurrentDateHour])
    const { start, end } = ShiftModule.concatDate(date, shift, false);
    const [ isAfter, isBefore ] = R.map(fn => fn(start, end, hour), [ShiftModule.dayIsAfter, ShiftModule.dayIsBefore]);

    if (isAfter) end.add(1, 'day');
    if (isBefore) start.subtract(1, 'day');

    return { start, end };
  }

  public static getDateUtc = (shift: any, isPrevious?: boolean): any => {
    const [ date, hour ] = R.map(fn => fn(true), [ShiftModule.getCurrentDate, ShiftModule.getCurrentDateHour])
    const { start, end } = ShiftModule.concatDate(date, shift, true);
    
    if (R.and(isPrevious, moment(hour).isBefore(end))) {
      return { start: start.subtract(1, 'day'), end: end.subtract(1, 'day') };
    }

    const [ isAfter, isBefore ] = R.map(fn => fn(start, end, hour), [ShiftModule.dayIsAfter, ShiftModule.dayIsBefore]);

    if (isAfter) end.add(1, 'day');
    if (isBefore) start.subtract(1, 'day');

    return { start, end };
  }

  public static getCurrentDate = R.cond([
      [R.equals(true), _ => moment().utc().format('YYYY-MM-DD')],
      [R.equals(false), _ => moment.tz(process.env.TIME_ZONE).format('YYYY-MM-DD')]
    ]);

  public static getCurrentDateHour = R.cond([
      [R.equals(true), _ => moment().utc().format('YYYY-MM-DD HH:mm:ss')],
      [R.equals(false), _ => moment.tz(process.env.TIME_ZONE).format('YYYY-MM-DD HH:mm:ss')]
    ]);

  private static concatDate = (date: any, shift: IShift, utc: boolean): any => {
    const { startTime, endTime } = R.pick(['startTime', 'endTime'], shift);
    const fn = R.cond([
      [R.equals(true), _ => 
        Object.assign({}, { 
          start: moment(`${date} ${startTime}`).utc(), 
          end: moment(`${date} ${endTime}`).utc() 
        }
      )],
      [R.equals(false), _ => 
        Object.assign({}, { 
          start: moment(`${date} ${startTime}`), 
          end: moment(`${date} ${endTime}`) 
        }
      )]
    ]);
    
    return fn(utc);
  }

  private static dayIsAfter = (start: any, end: any, hour: any):boolean =>
    end.isBefore(start) && moment(hour).isAfter(start);

  private static dayIsBefore = (start: any, end: any, hour: any):boolean =>
    end.isBefore(start) && moment(hour).isBefore(start);

}

export { ShiftModule };