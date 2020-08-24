'use strict';

const tag = 'Shoppings';

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
                consecutive: 100,
                folio: 'GREE-FG675',
                status: '201',
                iva: 120,
                subtotal: 200,
                total: 250,
                tip: 0,
                totalLetters: 'DOSCIENTOS CINCUENTA PESOS',
                sendToCloud: true,
                paymentTransactionId: '5f435f2893421b0b8892d9a6',
                positionId: '5f435f3acc10cff533a85934',
                products: [],
                userId: '5f435f576d72dde61746ee70',
                clientId: '5f435f6789b9a3ecaba85a3f',
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
              consecutive: 100,
              folio: 'GREE-FG675',
              status: '201',
              iva: 120,
              subtotal: 200,
              total: 250,
              tip: 0,
              totalLetters: 'DOSCIENTOS CINCUENTA PESOS',
              sendToCloud: true,
              paymentTransactionId: '5f435f2893421b0b8892d9a6',
              positionId: '5f435f3acc10cff533a85934',
              products: [],
              userId: '5f435f576d72dde61746ee70',
              clientId: '5f435f6789b9a3ecaba85a3f',
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
            description: 'Current status of purchase'
          },
          iva: {
            type: 'number',
            description: 'Purchase VAT tax'
          },
          subtotal: {
            type: 'number',
            description: 'Purchase subtotal'
          },
          total: {
            type: 'number',
            description: 'Purchase total'
          },
          tip: {
            type: 'string',
            description: 'Purchase tip'
          },
          totalLetters: {
            type: 'string',
            description: 'Total in letters'
          },
          products: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Products purchased'
          },
          userId: {
            type: 'string',
            description: 'The ID of employee'
          },
          clientId: {
            type: 'string',
            description: 'The ID of client'
          }
        },
        required: []
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Shopping ID',
    required: true,
    schema: { type: 'string' },
  },
];

const shoppingPaths = {
  '/shoppings': {
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
  '/shoppings/{id}': {
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

module.exports = { shoppingPaths };