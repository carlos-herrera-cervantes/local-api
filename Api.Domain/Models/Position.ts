'use strict';

import { Schema, model } from 'mongoose';
import { IPosition } from './IPosition';
import moment from 'moment';

const PositionSchema = new Schema({
    status: {
        type: String,
        default: '200'
    },
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        unique: true,
        default: 1
    },
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
});

const Position = model<IPosition>('Position', PositionSchema);

export { Position };