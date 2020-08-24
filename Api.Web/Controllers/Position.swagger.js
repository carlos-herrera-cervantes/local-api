'use strict';

const tag = 'Positions';

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
                status: '200',
                name: 'North 1',
                number: 1,
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
              status: '200',
              name: 'North 1',
              number: 1,
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
          status: {
            type: 'string',
            description: 'Current status of gas dispenser'
          },
          name: {
            type: 'string',
            description: 'Position name'
          },
          number: {
            type: 'number',
            description: 'Position number'
          }
        },
        required: ['name', 'number']
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Position ID',
    required: true,
    schema: { type: 'string' },
  },
];

const positionPaths = {
  '/positions': {
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
  '/positions/{id}': {
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

module.exports = { positionPaths };