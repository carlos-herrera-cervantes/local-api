'use strict';

import { Schema, model, Types } from 'mongoose';
import { ICollectMoney } from './ICollectMoney';
import { setTimestamps } from './Base';

const CollectMoneySchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'cash'
    },
    createdAt: {
        type: Date,
        default: setTimestamps()
    },
    updatedAt: {
        type: Date,
        default: setTimestamps()
    }
},
{
    versionKey: false
});

const CollectMoney = model<ICollectMoney>('CollectMoney', CollectMoneySchema);

export { CollectMoney };