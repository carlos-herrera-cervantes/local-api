'use strict';

import { Document } from  'mongoose';

interface IClient extends Document {
    firstName: string,
    lastName: string,
    email: string,
    gender?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export { IClient };