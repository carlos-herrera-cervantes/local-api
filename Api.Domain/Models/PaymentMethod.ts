'use strict';

import { Schema, model } from 'mongoose';
import { IPaymentMethod } from './IPaymentMethod';
import moment from 'moment';

const PaymentMethodSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
},
{
    versionKey: false
});

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);

export { PaymentMethod };