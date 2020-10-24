'use strict';

import { Schema, model } from 'mongoose';
import { IStation } from './IStation';
import { setTimestamps } from './Base';

const StationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  stationKey: {
    type: String,
    unique: true,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  street: {
    type: String
  },
  outside: {
    type: String
  },
  zipCode: {
    type: String
  },
  state: {
    type: String
  },
  municipality: {
    type: String
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

const Station = model<IStation>('Station', StationSchema);

export { Station };