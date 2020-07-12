'use strict';

import { Schema, model, Types } from 'mongoose';
import { IProduct } from './IProduct';
import { ProductTax } from './ProductTax';
import moment from 'moment';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    pricePublic: {
        type: Number,
        default: 0
    },
    taxId: [
        {
            type: ProductTax,
            ref: 'ProductTax'
        }
    ],
    measurementUnitId: {
        type: Types.ObjectId,
        ref: 'MeasurementUnit',
        default: null
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

const Product = model<IProduct>('Product', ProductSchema);

export { Product };