'use strict';

import R from "ramda";

export {};

declare global {
    interface String {
        toBoolean(): boolean;
        toInt(): number;
    }
}

String.prototype.toBoolean = function () {
    const _self = this as string;
    return R.equals(_self, 'true');
}