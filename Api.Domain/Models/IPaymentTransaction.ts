'use strict';

import { Document } from 'mongoose';

interface IPaymentTransaction extends Document {
    status: number,
    quantity: number,
    metadata: any,
    createdAt?: Date,
    updatedAt?: Date
}

export { IPaymentTransaction };