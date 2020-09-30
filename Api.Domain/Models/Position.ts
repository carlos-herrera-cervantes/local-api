'use strict';

import { Schema, model } from 'mongoose';
import { IPosition } from './IPosition';
import { setTimestamps } from './Base';

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

const Position = model<IPosition>('Position', PositionSchema);

export { Position };