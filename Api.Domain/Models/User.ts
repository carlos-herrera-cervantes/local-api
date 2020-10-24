'use strict';

import { Schema, model } from 'mongoose';
import { IUser } from './IUser';
import { Roles } from '../Constants/Roles';
import { setTimestamps } from './Base';
import { hash } from 'bcrypt';

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

UserSchema.pre('save', async function(next) {
  const password = this['password'];
  this['password'] = await hash(password, 10);
  next();
});

const User = model<IUser>('User', UserSchema);

export { User };