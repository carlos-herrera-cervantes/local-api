'use strict';

const tag = 'Payment Method';

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
                key: '01',
                name: 'EFECTIVO',
                description: 'Pago en efectivo',
                status: true,
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
              key: '01',
              name: 'EFECTIVO',
              description: 'Pago en efectivo',
              status: true,
              createdAt: '2011-01-21T11:33:21Z',
              updatedAt: '2011-01-21T11:33:21Z'
            }
          }
        }
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Payment method ID',
    required: true,
    schema: { type: 'string' },
  },
];

const paymentMethodPaths = {
  '/payment-methods': {
    get: {
      tags: [tag],
      responses: {
        200: ok
      }
    }
  },
  '/payment-methods/{id}': {
    get: {
      tags: [tag],
      parameters: generalParameters,
      responses: {
        200: created
      }
    }
  }
};

module.exports = { paymentMethodPaths };