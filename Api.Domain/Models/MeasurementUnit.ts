'use strict';

import { Schema, model } from 'mongoose';
import { IMeasurementUnit } from './IMeasurementUnit';
import moment from 'moment';

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
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
},
{
    versionKey: false
});

const MeasurementUnit = model<IMeasurementUnit>('MeasurementUnit', MeasurementUnitSchema);

export { MeasurementUnit };