'use strict';

import { Document } from 'mongoose';

interface IPosition extends Document {
    status: string,
    name: string,
    number: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export { IPosition };