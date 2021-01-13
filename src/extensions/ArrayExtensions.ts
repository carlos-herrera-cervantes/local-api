import * as R from 'ramda';

export {};

declare global {
  interface Array<T> {
    selectOne(fn: Function): any;
    merge(another: Array<any>, key1: string, key2: string): Array<T>;
  }
}

/**
 * Select one element by filter
 * @param fn Function
 * @returns Any
 */
Array.prototype.selectOne = function (fn: Function) {
  const _self = this as Array<any>;
  return _self.map(item => fn(item)).filter(item => item).pop();
}

/**
 * Merge one list of objects with other by specific key
 * @param key1 Key name
 * @param key2 Key name
 * @returns List
 */
Array.prototype.merge = function(another: Array<any>, key1: string, key2: string) {
  const _self = this as Array<any>;
  const result: any = [];

  for (const item of _self) {
    const selected = another.find((element: any) => item[key1].toString() == element[key2].toString());

    if (R.isEmpty(selected)) continue;

    result.push(Object.assign(item.toObject(), selected.toObject()));
  }

  return result;
}