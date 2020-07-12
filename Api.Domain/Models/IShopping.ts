'use strict';

import { Document, Types } from 'mongoose';
import { ISoldProduct } from './ISoldProduct';

interface IShopping extends Document {
    consecutive: number,
    folio: string,
    status: string,
    iva?: number,
    subtotal?: number,
    total?: number,
    tip?: number,
    totalLetters?: string,
    sendToCloud?: boolean,
    paymentTransactionId?: Types.ObjectId,
    positionId?: Types.ObjectId,
    products?: ISoldProduct[],
    userId?: Types.ObjectId,
    clientId?: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IShopping };