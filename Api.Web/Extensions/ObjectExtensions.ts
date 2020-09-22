'use strict';

import R from 'ramda';

class ObjectExtensions extends Object {

  public static containsKey = (value: object, key: string): boolean => key in value;

  public static deleteKeyExcept = (value: object, _key: string): object => {
    Object.entries(value).forEach(([ key, value ]) => {
      if (!R.equals(key, _key)) delete value[key];
    });
    return value;
  }

}

export { ObjectExtensions };