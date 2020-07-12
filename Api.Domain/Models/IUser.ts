'use strict';

import { Document } from 'mongoose';

interface IUser extends Document {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    cardMoneyAmount?: number,
    cashMoneyAmount?: number,
    role?: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IUser };