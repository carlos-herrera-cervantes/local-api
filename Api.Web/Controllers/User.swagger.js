'use strict';

const tag = 'User';

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
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'secret',
                cardMoneyAmount: 200,
                cashMoneyAmount: 3000,
                role: 'superadmin',
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
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              password: 'secret',
              cardMoneyAmount: 200,
              cashMoneyAmount: 3000,
              role: 'superadmin',
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
          email: {
            type: 'string',
            description: 'User email'
          },
          firstName: {
            type: 'string',
            description: `User's first name`
          },
          lastName: {
            type: 'string',
            description: `User's last name`
          },
          password: {
            type: 'string',
            description: 'User password'
          },
          cashMoneyAmount: {
            type: 'number',
            description: 'Cash the employee has'
          },
          cashMoneyAmount: {
            type: 'number',
            description: 'Money in vouchers that the employee has'
          },
          role: {
            type: 'string',
            description: 'User role',
            enum: ['Employee', 'StationAdmin', 'SuperAdmin']
          }
        },
        required: ['name', 'description']
      }
    }
  }
};

const login = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User email'
          },
          password: {
            type: 'string',
            description: 'User password'
          }
        },
        required: ['email', 'password']
      }
    }
  }
};

const loginResponse = {
  description: 'OK response',
  content: {
    'application/json': {
      examples: {
        collect: {
          value: {
            status: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvc0BleGFtcGxlLmNvbSIsImlhdCI6MTU5NDQ5ODczNn0.wdzu6bj_tfWfLpVh7xpypQZNx8pK0zndB9ect96yfRU'
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
    description: 'User ID',
    required: true,
    schema: { type: 'string' },
  },
];

const userPaths = {
  '/users': {
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
  '/users/{id}': {
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
  },
  '/users/login': {
    post: {
      tags: [tag],
      requestBody: login,
      responses: {
        200: loginResponse
      }
    }
  },
  '/users/logout': {
    post: {
      tags: [tag],
      responses: {
        204: {}
      }
    }
  }
};

module.exports = { userPaths };