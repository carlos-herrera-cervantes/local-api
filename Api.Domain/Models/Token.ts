'use strict';

import { Schema, model, Types } from 'mongoose';
import { IToken } from './IToken';
import { setTimestamps } from './Base';

const TokenSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
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

const Token = model<IToken>('Token', TokenSchema);

export { Token };