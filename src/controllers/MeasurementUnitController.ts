import { Controller, Get, Post, Patch, Delete, BodyParams, PathParams, UseBefore, QueryParams } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { MeasurementUnitService } from '../services/MeasurementUnitService';
import { MeasurementUnit } from '../models/MeasurementUnit';
import { ValidatorRole, ValidatorMeasurementUnitExists } from '../decorators/ValidatorDecorator';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  measurementObjectExample 
} from '../swagger/Examples';

@Controller('/measurement-units')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ErrorMiddleware)
export class MeasurementUnitController {

  constructor(private readonly measurementService: MeasurementUnitService) { }
  
  @Get()
  @Summary('Return a list of measurements')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ measurementObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @UseBefore(AuthorizeMiddleware)
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  @UseBefore(ErrorMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<MeasurementUnit>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [units, totalDocs] = await Promise.all([
      this.measurementService.getAllAsync(filter),
      this.measurementService.countDocuments(filter)
    ]);

    return new Paginator<MeasurementUnit>(units, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific measurement')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(measurementObjectExample) ])
  @(Status(404).Description('Measurement not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorMeasurementUnitExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<MeasurementUnit> {
    return await this.measurementService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new measurement')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(measurementObjectExample) ])
  @(Status(400).Description('Invalid measurement'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  async createAsync(@BodyParams() measurement: MeasurementUnit): Promise<MeasurementUnit> {
    return await this.measurementService.createAsync(measurement);
  }

  @Patch('/:id')
  @Summary('Updates existing measurement')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(measurementObjectExample) ])
  @(Status(404).Description('Measurement not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid measurement'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorMeasurementUnitExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() measurement: any): Promise<MeasurementUnit> {
    return await this.measurementService.updateOneByIdAsync(id, measurement);
  }

  @Delete('/:id')
  @Summary('Deletes existing measurement')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Measurement not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorMeasurementUnitExists('_id')
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.measurementService.deleteOneByIdAsync(id);
  }
}