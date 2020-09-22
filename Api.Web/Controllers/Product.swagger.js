'use strict';

const tag = 'Products';

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
                name: 'Aceite RE',
                price: 45,
                pricePublic: 50,
                description: 'Aceite para auto',
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
              name: 'Aceite RE',
              price: 45,
              pricePublic: 50,
              description: 'Aceite para auto',
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
    description: 'Product ID',
    required: true,
    schema: { type: 'string' },
  },
];

const productsPaths = {
  '/products': {
    get: {
      tags: [tag],
      responses: {
        200: ok
      }
    }
  },
  '/products/{id}': {
    get: {
      tags: [tag],
      parameters: generalParameters,
      responses: {
        200: created
      }
    }
  }
};

module.exports = { productsPaths };