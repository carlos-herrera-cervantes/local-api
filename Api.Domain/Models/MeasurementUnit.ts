'use strict';

import { Schema, model } from 'mongoose';
import { IMeasurementUnit } from './IMeasurementUnit';
import { setTimestamps } from './Base';

const MeasurementUnitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true
    },
    keySat: {
        type: String,
        required: true
    },
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

const MeasurementUnit = model<IMeasurementUnit>('MeasurementUnit', MeasurementUnitSchema);

export { MeasurementUnit };