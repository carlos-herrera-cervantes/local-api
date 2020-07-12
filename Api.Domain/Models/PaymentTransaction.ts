'use strict';

import { Schema, model } from 'mongoose';
import { IPaymentTransaction } from './IPaymentTransaction';
import moment from 'moment';

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
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
});

const PaymentTransaction = model<IPaymentTransaction>('PaymentTransactions', PaymentTransactionSchema);

export { PaymentTransaction };