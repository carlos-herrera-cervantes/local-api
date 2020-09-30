'use strict';

import { Schema, model, Types } from 'mongoose';
import { IShift } from './IShift';
import { ShiftModule } from '../../Api.Web/Modules/ShiftModule';
import { setTimestamps } from './Base';

const ShiftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
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
        default: setTimestamps()
    },
    updatedAt: {
        type: Date,
        default: setTimestamps()
    }
},
{
    versionKey: false
});

ShiftSchema.methods.getIntervalsUtc = function (isPrevious) {
    return ShiftModule.getDateUtc(this, isPrevious);
}

const Shift = model<IShift>('Shift', ShiftSchema);

export { Shift };