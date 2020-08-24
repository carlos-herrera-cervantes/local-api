'use strict';

const { collectPaths } = require('../Controllers/Collect.swagger');
const { measurementUnitPaths } = require('../Controllers/MeasurementUnit.swagger');
const { positionPaths } = require('../Controllers/Position.swagger');
const { shiftPaths } = require('../Controllers/Shift.swagger');
const { shoppingPaths } = require('../Controllers/Shopping.swagger');
const { taxPaths } = require('../Controllers/Tax.swagger');
const { userPaths } = require('../Controllers/User.swagger');
const R = require('ramda');

const paths = [
  collectPaths,
  measurementUnitPaths,
  positionPaths,
  shiftPaths,
  shoppingPaths,
  taxPaths,
  userPaths
];

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Gulf Remastered - Cloud API',
    description: 'Services to interact with the cloud API of Gulf Remastered project',
  },
  components: {
    schemas: {},
    securitySchemes: {
      BearerAuthorization: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  security: [
    {
      BearerAuthorization: [],
    },
  ],
  paths: R.mergeAll(paths)
};

module.exports = { swaggerDocument };