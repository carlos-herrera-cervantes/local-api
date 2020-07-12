'use strict';

import { Schema, Types, model } from 'mongoose';
import { IUser } from './IUser';
import { Roles } from '../Constants/Roles';
import moment from 'moment';

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    cardMoneyAmount: {
        type: Number,
        default: 0
    },
    cashMoneyAmount: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: Roles.Employee
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

const User = model<IUser>('User', UserSchema);

export { User };