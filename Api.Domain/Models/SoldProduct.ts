'use strict';

import { Schema, model, Types } from 'mongoose';
import { ISoldProduct } from './ISoldProduct';
import moment from 'moment';

const SoldProductSchema = new Schema({
    quantity: {
        type: Number,
        default: 0
    },
    priceUnit: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    productId: {
        type: Types.ObjectId,
        ref: 'Product'
    }
});

const SoldProduct = model<ISoldProduct>('SoldProduct', SoldProductSchema);

export { SoldProduct };