'use strict';

import { Schema, model, Types } from 'mongoose';
import { IShopping } from './IShopping';
import { setTimestamps } from './Base';

const ShoppingSchema = new Schema({
    consecutive: {
        type: Number,
        default: 1
    },
    folio: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        default: '200'
    },
    iva: {
        type: Number,
        default: 0
    },
    subtotal: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    tip: {
        type: Number,
        default: 0
    },
    totalLetters: {
        type: String,
        default: ''
    },
    sendToCloud: {
        type: Boolean,
        default: false
    },
    paymentTransactionId: {
        type: Types.ObjectId,
        ref: 'PaymentTransaction',
        default: null
    },
    positionId: {
        type: Types.ObjectId,
        ref: 'Position',
        required: true
    },
    products: [
        {
            productId: { type: Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 0 }
        }
    ],
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
    clientId: {
        type: Types.ObjectId,
        ref: 'Client',
        required: true
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

const Shopping = model<IShopping>('Shopping', ShoppingSchema);

export { Shopping };