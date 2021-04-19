import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {

  /**
   * Returns string dates: long, short and only time
   * @param date
   * @returns Object
   */
  formatLocalStringDate(date: Date): any {
    return {
      stringLongDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` + 
                      'T' + 
                      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      stringShortDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      stringTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      date
    };
  }

  /**
  * Returns string dates: long, short and only time
  * @param date
  * @returns Object
  */
  formatUTCStringDate(date: Date): any {
    return {
      stringLongDate: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}` + 
                      'T' + 
                      `${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      stringShortDate: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
      stringTime: `${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      date
    };
  }

  /**
   * Creates a Date object by using numbers
   * @param numbers
   * @returns Date
   */
  createDateByArray(numbers: any[]): Date {
    return new Date(numbers[0], numbers[1], numbers[2], numbers[3], numbers[4], numbers[5]);
  }

  /**
   * Split a date string with format YYYY-MM-DDTHH:mm:ss
   * @param date
   * @returns List of numbers
   */
  splitByString(date: string): any[] {
    return date
      .split('T')
      .map((element: any) => element.includes('-') ? element.split('-') : element.split(':'))
      .reduce((accumulator: any, value: any) => accumulator.concat(value), [])
      .map((element: any) => parseInt(element));
  }

  /**
   * Checks if string contain 
   * @param date 
   */
  validateStringDate(date: string): string {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    return date.includes('T') ? date : formatted + 'T' + date;
  }

  /**
   * Returns string dates by specific date: long, short and only time
   * @param date
   * @return Object
   */
  setUTCDate(date: string): any {
    const isValid = this.validateStringDate(date);
    const splited = this.splitByString(isValid);
    const created = this.createDateByArray(splited);
    
    return this.formatUTCStringDate(created);
  }

  /**
   * Returns string dates by specific date: long, short and only time
   * @param date
   * @return Object
   */
  setLocalDate(date: string): any {
    const isValid = this.validateStringDate(date);
    const splited = this.splitByString(isValid);
    const created = this.createDateByArray(splited);

    return this.formatLocalStringDate(created);
  }

  /**
   * Returns string dates: long, short and only time
   * @return Object
   */
  getUTCDate(): any {
    return this.formatUTCStringDate(new Date());
  }

  /**
   * Returns string dates: long, short and only time
   * @return Object
   */
  getLocalDate(): any {
    return this.formatLocalStringDate(new Date());
  }
}