'use strict';

const tag = 'Collect';

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
                userId: '5f430e089ced6eafa33aefdf',
                amount: 100,
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
              userId: '5f430e089ced6eafa33aefdf',
              amount: 100,
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
          userId: {
            type: 'string',
            description: 'The ID of employee'
          },
          amount: {
            type: 'number',
            description: 'The collected amount'
          }
        },
        required: ['userId', 'amount']
      }
    }
  }
};

const collectPaths = {
  '/collects': {
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
  '/collects/{id}': {
    get: {
      tags: [tag],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Collect ID',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: created
      }
    },
    patch: {
      tags: [tag],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Collect ID',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody,
      responses: {
        201: created
      }
    },
    delete: {
      tags: [tag],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Collect ID',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        204: {}
      }
    }
  }
};

module.exports = { collectPaths };