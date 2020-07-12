'use strict';

import { Document, Types } from 'mongoose';
import { IProductTax } from './IProductTax';

interface IProduct extends Document {
    name: string,
    description: string,
    price: number,
    pricePublic: number,
    taxes: IProductTax,
    measurementUnitId: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IProduct };