'use strict';

import { Schema, model, Types } from 'mongoose';
import { ICollectMoney } from './ICollectMoney';
import moment from 'moment';

const CollectMoneySchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    }
},
{
    versionKey: false
});

const CollectMoney = model<ICollectMoney>('CollectMoney', CollectMoneySchema);

export { CollectMoney };