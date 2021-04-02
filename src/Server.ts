import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import { WrapperResponseFilter } from './wrappers/WrapperResponseFilter'
import { LocalizationMiddleware } from './middlewares/LocalizationMiddleware';
import { UpdateDateMiddleware } from './middlewares/UpdateDateMiddleware';
import '@tsed/platform-express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import '@tsed/ajv';
import '@tsed/swagger';
import '@tsed/mongoose';
import * as parameters from '../parameters.json';
const redisStore = require('cache-manager-ioredis');

export const rootDir = __dirname;

@Configuration({
  cache: {
    ttl: 300,
    store: redisStore,
    host: 'localhost',
    port: 6379,
    db: 0
  },
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: parameters.app.port,
  httpsPort: false, // CHANGE
  responseFilters: [
    WrapperResponseFilter
  ],
  mount: {
    '/api/v1': [
      `${rootDir}/controllers/**/*.ts`
    ],
    // '/': [IndexCtrl]
  },
  swagger: [
    {
      path: '/v2/docs',
      specVersion: '2.0'
    },
    {
      path: '/v3/docs',
      specVersion: '3.0.1'
    }
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: 'ejs'
  },
  mongoose: [
    {
      id: 'default',
      url: `mongodb://${parameters.db.host}/${parameters.db.database}`,
      connectionOptions: {}
    }
  ],
  exclude: [
    '**/*.spec.ts'
  ]
})

export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(LocalizationMiddleware)
      .use(UpdateDateMiddleware);
  }
}