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

export const rootDir = __dirname;

@Configuration({
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
      path: '/docs',
      specVersion: '3.0.1',
      spec: {
        info: {
          title: "Local API",
          version: '1.0.0',
          description: "Swagger 3.0.1 API specification. This API spec can be used for integrating your application project into non-HTML5 programs like `native` phone apps, `legacy` and `enterprise` systems, embedded `Internet of Things` applications (IoT), and other programming languages.  Note: The URL's below are configured for your specific project and form.",
        },
        components: {
          securitySchemes: {
            jwt: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Run a sign-in on /api/v1/login to get a valid Access Token."
            }
          }
        }
      }
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