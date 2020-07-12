'use strict';

import { Schema, model, Types } from 'mongoose';
import { IProductTax } from './IProductTax';

const ProductTaxSchema = new Schema({
    percentage: {
        type: Number,
        default: 0
    },
    taxId: {
        type: Types.ObjectId,
        ref: 'Tax'
    }
});

const ProductTax = model<IProductTax>('ProductTax', ProductTaxSchema);

export { ProductTax };