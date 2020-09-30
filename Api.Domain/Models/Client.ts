'use strict';

import { Schema, model } from 'mongoose';
import { IClient } from './IClient';
import { Genders } from '../Constants/Genders';
import { setTimestamps } from './Base';

const ClientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
        default: Genders.No_Specified
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

const Client = model<IClient>('Client', ClientSchema);

export { Client };