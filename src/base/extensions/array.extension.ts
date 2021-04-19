export { };

declare global {
  interface Array<T> {
    merge(another: Array<any>, key1: string, key2: string): Array<T>;
  }
}

/**
 * Merge one list of objects with other by specific key
 * @param key1 Key name
 * @param key2 Key name
 * @returns List
 */
Array.prototype.merge = function (another: Array<any>, key1: string, key2: string) {
  const _self = this as Array<any>;
  const result: any = [];

  for (const item of _self) {
    const selected = another.find((element: any) => item[key1].toString() == element[key2].toString());

    if (!selected) continue;

    result.push(Object.assign(item, selected));
  }

  return result;
}