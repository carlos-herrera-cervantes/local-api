'use strict';

import { Schema, model, Types } from 'mongoose';
import { IShift } from './IShift';
import moment from 'moment';

const ShiftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true,
        trim: true
    },
    endTime: {
        type: String,
        required: true,
        trim: true
    },
    monday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    tuesday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    wednesday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    thursday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    friday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    saturday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    sunday: [
        {
            type: Types.ObjectId,
            ref: 'Dispatcher'
        }
    ],
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
});

const Shift = model<IShift>('Shift', ShiftSchema);

export { Shift };