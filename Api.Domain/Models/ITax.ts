'use strict';

import { Document } from 'mongoose';

interface ITax extends Document {
    name: string,
    description: string,
    status: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export { ITax };