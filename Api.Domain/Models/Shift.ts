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
            ref: 'User'
        }
    ],
    tuesday: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    wednesday: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    thursday: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    friday: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    saturday: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    sunday: [
        {
            type: Types.ObjectId,
            ref: 'User'
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