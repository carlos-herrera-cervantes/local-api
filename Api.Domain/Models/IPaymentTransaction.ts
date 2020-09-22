'use strict';

import { Document, Types } from 'mongoose';

interface IPaymentTransaction extends Document {
    status?: number,
    quantity: number,
    metadata?: any,
    paymentMethodId: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

export { IPaymentTransaction };