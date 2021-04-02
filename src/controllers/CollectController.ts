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
  collectObjectExample 
} from '../swagger/Examples';
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorCollectExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidateQuantityCollectMiddleware } from '../middlewares/ValidatorMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { CollectMoneyService } from '../services/CollectService';
import { CollectMoney } from '../models/CollectMoney';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { JsonWebToken } from '../models/JsonWebToken';
import { User } from '../models/User';
import { Roles } from '../constants/Roles';

@Controller('/collects')
@UseBefore(AuthorizeMiddleware)
export class CollectController {

  constructor(private readonly collectService: CollectMoneyService) { }

  @Get('/me')
  @Summary('Return a list of collects for specific user in session')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ collectObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin, Roles.Employee)
  @UseBefore(ErrorMiddleware)
  async getAllMeAsync(@QueryParams() queryParams: Parameters, @HeaderParams() headers: object): Promise<Paginator<CollectMoney>> {
    const { _id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as User;
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    filter.criteria.user = _id;
    const [collects, totalDocs] = await Promise.all([
      this.collectService.getAllAsync(filter),
      this.collectService.countDocuments(filter)
    ])
    
    return new Paginator<CollectMoney>(collects, queryParams, totalDocs).pager();
  }

  @Post('/me')
  @Summary('Create a new collect for specific user in session')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(collectObjectExample) ])
  @(Status(400).Description('Invalid collect'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin, Roles.Employee)
  @UseBefore(ValidateQuantityCollectMiddleware)
  @UseBefore(ErrorMiddleware)
  async createMeAsync(@HeaderParams() headers: object, @BodyParams() collect: any): Promise<CollectMoney> {
    const { _id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as User;
    collect.user = _id;
    return await this.collectService.createAsync(collect);
  }
  
  @Get()
  @Summary('Return a list of collects')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ collectObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ErrorMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<CollectMoney>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    const [collects, totalDocs] = await Promise.all([
      this.collectService.getAllAsync(filter),
      this.collectService.countDocuments(filter)
    ])
    
    return new Paginator<CollectMoney>(collects, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific collect')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(collectObjectExample) ])
  @(Status(404).Description('Collect not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorCollectExists('_id')
  @UseBefore(ErrorMiddleware)
  async getByIdAsync(@PathParams('id') id: string): Promise<CollectMoney> {
    return await this.collectService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new collect')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(collectObjectExample) ])
  @(Status(400).Description('Invalid collect'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidateQuantityCollectMiddleware)
  @UseBefore(ErrorMiddleware)
  async createAsync(@BodyParams() collect: CollectMoney): Promise<CollectMoney> {
    return await this.collectService.createAsync(collect);
  }

  @Patch('/:id')
  @Summary('Updates existing collect')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(collectObjectExample) ])
  @(Status(404).Description('Collect not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid collect'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorCollectExists('_id')
  @UseBefore(ErrorMiddleware)
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() collect: any): Promise<CollectMoney> {
    return await this.collectService.updateOneByIdAsync(id, collect);
  }

  @Delete('/:id')
  @Summary('Deletes existing collect')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Collect not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorCollectExists('_id')
  @UseBefore(ErrorMiddleware)
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.collectService.deleteOneByIdAsync(id);
  }
}