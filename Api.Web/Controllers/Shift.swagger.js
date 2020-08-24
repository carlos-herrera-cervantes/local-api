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
                name: 'Matutino',
                startTime: '08:00:00',
                endTime: '11:59:59',
                monday: [
                  '5f435bd0fd6a3d74f5330049'
                ],
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
              name: 'Matutino',
              startTime: '08:00:00',
              endTime: '11:59:59',
              monday: [
                '5f435bd0fd6a3d74f5330049'
              ],
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
            description: 'Shift name'
          },
          startTime: {
            type: 'string',
            description: 'The time the shift starts'
          },
          endTime: {
            type: 'string',
            description: 'The time the shift ends'
          },
          monday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          tuesday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          wednesday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          thursday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          friday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          saturday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          },
          sunday: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The IDs of the employees working that day'
          }
        },
        required: ['name', 'startTime', 'endTime']
      }
    }
  }
};

const generalParameters = [
  {
    name: 'id',
    in: 'path',
    description: 'Shift ID',
    required: true,
    schema: { type: 'string' },
  },
];

const shiftPaths = {
  '/shifts': {
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
  '/shifts/{id}': {
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

module.exports = { shiftPaths };