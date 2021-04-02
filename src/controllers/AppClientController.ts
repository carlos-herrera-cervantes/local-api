import { 
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  BodyParams,
  PathParams,
  UseBefore,
  QueryParams,
  HeaderParams
} from "@tsed/common";
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  appClientObjectExample 
} from '../swagger/Examples';
import { Summary, Status } from '@tsed/schema';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidatorRole } from '../decorators/ValidatorDecorator';
import { AppClientService } from '../services/AppClientService';
import { AppClient } from '../models/AppClient';
import { Paginator } from '../models/Paginator';
import { Parameters } from '../models/Paramameters';
import { Filter } from '../models/Filter';
import { JsonWebToken } from '../models/JsonWebToken'
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { Roles } from '../constants/Roles';

@Controller('/app-clients')
export class AppClientController {

  constructor(private readonly appClientService: AppClientService) { }

  @Get('/me')
  @Summary('Return a specific app client in session')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(appClientObjectExample) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin, Roles.AppClient)
  @UseBefore(ErrorMiddleware)
  async getMeAsync(@HeaderParams() headers: object): Promise<AppClient> {
    const client = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as AppClient;
    return client;
  }

  @Get()
  @Summary('Return a list of app clients')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ appClientObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin)
  @UseBefore(ErrorMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<AppClient>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [clients, totalDocs] = await Promise.all([
      this.appClientService.getAllAsync(filter),
      this.appClientService.countDocuments(filter)
    ]);

    return new Paginator<AppClient>(clients, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific app client')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(appClientObjectExample) ])
  @(Status(404).Description('App client not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin)
  @UseBefore(ErrorMiddleware)
  async getByIdAsync(@PathParams('id') id: string): Promise<AppClient> {
    return await this.appClientService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new app client')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(appClientObjectExample) ])
  @(Status(400).Description('Invalid app client'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin)
  @UseBefore(ErrorMiddleware)
  async createAsync(@BodyParams() appClient: AppClient): Promise<AppClient> {
    return await this.appClientService.createAsync(appClient);
  }

  @Patch('/:id')
  @Summary('Updates existing app client')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(appClientObjectExample) ])
  @(Status(404).Description('App client not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid app client'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin)
  @UseBefore(ErrorMiddleware)
  async updateOneByIdAsync(
    @PathParams('id') id: string,
    @BodyParams() appClient: AppClient
  ): Promise<AppClient> {
    return await this.appClientService.updateOneByIdAsync(id, appClient);
  }

  @Delete('/:id')
  @Summary('Deletes existing app client')
  @(Status(204).Description('Success'))
  @(Status(404).Description('App client not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.AppClientAdmin)
  @UseBefore(ErrorMiddleware)
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.appClientService.deleteOneByIdAsync(id);
  }

}