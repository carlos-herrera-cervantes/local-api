'use strict';

const tag = 'Measurement Unit';

const ok = {
  description: 'OK response',
  content: {
    'application/json': {
      examples: {
        collect: {
          value: {
            status: true,
            data: [
              {
                _id: '5f4312fea39146efe94eb0fb',
                name: 'Litros',
                short: 'l',
                keySat: 'L',
                createdAt: '2011-01-21T11:33:21Z',
                updatedAt: '2011-01-21T11:33:21Z'
              }
            ]
          }
        }
      }
    }
  }
};

const created = {
  description: 'OK response',
  content: {
    'application/json': {
      examples: {
        collect: {
          value: {
            status: true,
            data: {
              _id: '5f4312fea39146efe94eb0fb',
              name: 'Litros',
              short: 'l',
              keySat: 'L',
              createdAt: '2011-01-21T11:33:21Z',
              updatedAt: '2011-01-21T11:33:21Z'
            }
          }
        }
      }
    }
  }
};

const requestBody = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Measurement unit name'
          },
          short: {
            type: 'string',
            description: 'The short name of measurement unit'
          },
          keySat: {
            type: 'string',
            description: 'The ID of the unit of measurement that is identified in the SAT platform'
          }
        },
        required: ['name', 'short', 'keySat']
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Measurement unit ID',
    required: true,
    schema: { type: 'string' },
  },
];

const measurementUnitPaths = {
  '/measurement-units': {
    get: {
      tags: [tag],
      responses: {
        200: ok
      }
    },
    post: {
      tags: [tag],
      requestBody,
      responses: {
        201: created
      }
    }
  },
  '/measurement-units/{id}': {
    get: {
      tags: [tag],
      parameters: generalParameters,
      responses: {
        200: created
      }
    },
    patch: {
      tags: [tag],
      parameters: generalParameters,
      requestBody,
      responses: {
        201: created
      }
    },
    delete: {
      tags: [tag],
      parameters: generalParameters,
      responses: {
        204: {}
      }
    }
  }
};

module.exports = { measurementUnitPaths };