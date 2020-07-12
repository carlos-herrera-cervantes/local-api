'use strict';

import { Schema, model } from 'mongoose';
import { IShopping } from './IShopping';
import moment from 'moment';

const ShoppingSchema = new Schema({
    consecutive: {
        type: Number,
        default: 1,
        required: true
    },
    folio: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        required: true
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
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
});

const Shopping = model<IShopping>('Shopping', ShoppingSchema);

export { Shopping };