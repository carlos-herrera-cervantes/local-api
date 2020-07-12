'use strict';

import { Document } from 'mongoose';

interface IMeasurementUnit extends Document {
    name: string,
    short: string,
    keySat: string,
    createdAt?: Date,
    updatedAt?: Date
}

export { IMeasurementUnit };