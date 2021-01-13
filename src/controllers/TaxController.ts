import { Controller, Get, Post, Patch, Delete, BodyParams, PathParams, UseBefore, QueryParams, Middleware } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorTaxExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { TaxService } from '../services/TaxService';
import { Tax } from '../models/Tax';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  taxObjectExample 
} from '../swagger/Examples';

@Controller('/taxes')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ErrorMiddleware)
export class TaxController {

  constructor(private readonly taxService: TaxService) { }
  
  @Get()
  @Summary('Return a list of taxes')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ taxObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<Tax>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    const [taxes, totalDocs] = await Promise.all([
      this.taxService.getAllAsync(filter),
      this.taxService.countDocuments(filter)
    ]);
    
    return new Paginator<Tax>(taxes, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific tax')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(taxObjectExample) ])
  @(Status(404).Description('Tax not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorTaxExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<Tax> {
    return await this.taxService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new tax')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(taxObjectExample) ])
  @(Status(400).Description('Invalid tax'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  async createAsync(@BodyParams() tax: Tax): Promise<Tax> {
    return await this.taxService.createAsync(tax);
  }

  @Patch('/:id')
  @Summary('Updates existing tax')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(taxObjectExample) ])
  @(Status(404).Description('Tax not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid tax'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorTaxExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() tax: any): Promise<Tax> {
    return await this.taxService.updateOneByIdAsync(id, tax);
  }

  @Delete('/:id')
  @Summary('Deletes existing tax')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Tax not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorTaxExists('_id')
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.taxService.deleteOneByIdAsync(id);
  }
}