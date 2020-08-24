'use strict';

const tag = 'Tax';

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
                name: 'IVA',
                status: true,
                description: 'Impuesto al valor añadido',
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
              name: 'IVA',
              status: true,
              description: 'Impuesto al valor añadido',
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
            description: 'Tax name'
          },
          status: {
            type: 'boolean',
            description: 'Current status of tax'
          },
          description: {
            type: 'string',
            description: 'A brief description of tax'
          }
        },
        required: ['name', 'description']
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Tax ID',
    required: true,
    schema: { type: 'string' },
  },
];

const taxPaths = {
  '/taxes': {
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
  '/taxes/{id}': {
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

module.exports = { taxPaths };