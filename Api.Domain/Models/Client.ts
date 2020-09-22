'use strict';

import { Schema, model } from 'mongoose';
import { IClient } from './IClient';
import { Genders } from '../Constants/Genders';
import moment from 'moment';

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

const Client = model<IClient>('Client', ClientSchema);

export { Client };