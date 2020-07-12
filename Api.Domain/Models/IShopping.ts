'use strict';

import { Document } from 'mongoose';

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
    createdAt?: Date,
    updatedAt?: Date,
}

export { IShopping };