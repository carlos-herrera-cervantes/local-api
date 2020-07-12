'use strict';

import { Schema, model, Types } from 'mongoose';
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
    paymentMethodId: {
        type: Types.ObjectId,
        ref: 'PaymentMethod'
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

const PaymentTransaction = model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);

export { PaymentTransaction };