'use strict';

class StringExtensions extends String {

    public static toBoolean = (value: any): boolean => value === 'true' ? true: false;

    public static toInt = (value: any): number => parseInt(value);

}

export { StringExtensions };