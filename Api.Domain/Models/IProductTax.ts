'use strict';

import { Document, Types } from 'mongoose';

interface IProductTax extends Document {
    percentage: number;
    taxeId: Types.ObjectId
}

export { IProductTax };