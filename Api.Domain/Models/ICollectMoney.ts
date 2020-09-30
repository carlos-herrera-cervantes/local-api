'use strict';

import { Document, Types } from 'mongoose';

interface ICollectMoney extends Document {
    userId: Types.ObjectId,
    amount: number,
    type?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export { ICollectMoney };