'use strict';

import { Document } from 'mongoose';

interface ITax extends Document {
    name: string,
    description: string,
    status: boolean,
    percentage?: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export { ITax };