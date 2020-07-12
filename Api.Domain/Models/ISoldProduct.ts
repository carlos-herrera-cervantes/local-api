'use strict';

import { Document, Types } from 'mongoose';

interface ISoldProduct extends Document {
    quantity: number,
    priceUnit: number,
    price: number,
    productId: Types.ObjectId
}

export { ISoldProduct };