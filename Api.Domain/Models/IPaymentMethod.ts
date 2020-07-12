'use strict';

import { Document } from 'mongoose';

interface IPaymentMethod extends Document {
    key: string,
    name: string,
    description: string,
    status?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IPaymentMethod };