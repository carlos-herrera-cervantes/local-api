'use strict';

import { Document } from 'mongoose';

interface IProduct extends Document {
    name: string,
    description: string,
    price: number,
    pricePublic: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IProduct };