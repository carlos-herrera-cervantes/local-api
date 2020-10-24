'use strict';

import { Document } from  'mongoose';

interface IStation extends Document {
    name: string,
    email: string,
    stationKey: string,
    active?: boolean,
    street?: string,
    outside?: string,
    zipCode?: string,
    state?: string,
    municipality?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export { IStation };