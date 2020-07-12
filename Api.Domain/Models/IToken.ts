'use strict';

import { Document, Types } from 'mongoose';

interface IToken extends Document {
    userId: Types.ObjectId,
    email: string,
    role: string,
    token: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IToken };