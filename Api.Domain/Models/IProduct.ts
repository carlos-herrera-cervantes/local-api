'use strict';

import { Document, Types } from 'mongoose';

interface IProduct extends Document {
    name: string,
    description: string,
    price: number,
    pricePublic: number,
    taxes?: Types.ObjectId[],
    measurementUnitId?: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IProduct };