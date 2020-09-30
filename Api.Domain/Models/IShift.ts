'use strict';

import { Document } from 'mongoose';

interface IShift extends Document {
    name: string,
    order: number,
    startTime: string,
    endTime: string,
    monday?: string[],
    tuesday?: string[],
    wednesday?: string[],
    thursday?: string[],
    friday?: string[],
    saturday?: string[],
    sunday?: string[],
    createdAt?: Date,
    updatedAt?: Date,

    getIntervalsUtc(isPrevious): any
}

export { IShift };