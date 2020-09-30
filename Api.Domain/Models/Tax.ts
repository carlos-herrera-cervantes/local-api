import { Schema, model } from 'mongoose';
import { ITax } from './ITax';
import { setTimestamps } from './Base';

const TaxSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    percentage: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: setTimestamps()
    },
    updatedAt: {
        type: Date,
        default: setTimestamps
    }
},
{
    versionKey: false
});

const Tax = model<ITax>('Tax', TaxSchema);

export { Tax };