'use strict';

import { Schema, model, Types } from 'mongoose';
import { IPaymentTransaction } from './IPaymentTransaction';
import { setTimestamps } from './Base';

const PaymentTransactionSchema = new Schema({
    status: {
        type: Number,
        default: 2
    },
    quantity: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Object,
        default: {}
    },
    paymentMethodId: {
        type: Types.ObjectId,
        ref: 'PaymentMethod'
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

const PaymentTransaction = model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);

export { PaymentTransaction };