'use strict';

import { Document, Types } from 'mongoose';

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
    products?: any[],
    userId?: Types.ObjectId,
    clientId?: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IShopping };