import * as R from 'ramda';

/**
 * Returns string dates: long, short and only time
 * @param date
 * @returns Object
 */
export const formatLocalStringDate = (date: any): any => (
  {
    stringLongDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` + 
                    'T' + 
                    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    stringShortDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    stringTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    date
  });

/**
 * Returns string dates: long, short and only time
 * @param date
 * @returns Object
 */
const formatUTCStringDate = (date: any): any => (
  {
    stringLongDate: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}` + 
                    'T' + 
                    `${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    stringShortDate: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
    stringTime: `${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    date
  });

/**
 * Creates a Date object by using numbers
 * @param numbers
 * @returns Date
 */
const createDateByArray = (numbers: any[]): any =>
  new Date(numbers[0], numbers[1], numbers[2], numbers[3], numbers[4], numbers[5]);

/**
 * Split a date string with format YYYY-MM-DDTHH:mm:ss
 * @param date
 * @returns List of numbers
 */
const splitByString = (date: any): any[] => 
  date
  .split('T')
  .map((element: any) => element.includes('-') ? element.split('-') : element.split(':'))
  .reduce((accumulator: any, value: any) => accumulator.concat(value), [])
  .map((element: any) => parseInt(element));

/**
 * Checks if string contain 
 * @param date 
 */
const validateStringDate = (date: string) => {
  const now = new Date();
  const formatted = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  return date.includes('T') ? date : formatted + 'T' + date;
}

/**
 * Returns string dates by specific date: long, short and only time
 * @param date
 * @return Object
 */
export const setUTCDate = R.compose(formatUTCStringDate, createDateByArray, splitByString, validateStringDate);

/**
 * Returns string dates by specific date: long, short and only time
 * @param date
 * @return Object
 */
export const setLocalDate = R.compose(formatLocalStringDate, createDateByArray, splitByString, validateStringDate);

/**
 * Returns string dates: long, short and only time
 * @return Object
 */
export const getUTCDate = () => formatUTCStringDate(new Date());

/**
 * Returns string dates: long, short and only time
 * @return Object
 */
export const getLocalDate = () => formatLocalStringDate(new Date());