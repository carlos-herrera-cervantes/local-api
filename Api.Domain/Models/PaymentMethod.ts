'use strict';

import { Schema, model } from 'mongoose';
import { IPaymentMethod } from './IPaymentMethod';
import { setTimestamps } from './Base';

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

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);

export { PaymentMethod };