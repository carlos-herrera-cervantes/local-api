import { Controller, Get, Post, Patch, Delete, BodyParams, PathParams, UseBefore, QueryParams, HeaderParams, $log } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorShiftExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { ShiftService } from '../services/ShiftService';
import { ShiftCommon } from '../common/ShiftCommon';
import { Shift } from '../models/Shift';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { JsonWebToken } from '../models/JsonWebToken';
import { CollectCommon } from '../common/CollectCommon';
import { SaleCommon } from '../common/SaleCommon';
import { 
  listDataResponseExample,
  singleDataResponseExample,
  badRequest,
  internalServerError,
  shiftObjectExample,
  shiftCutObjectExample
} from '../swagger/Examples';

@Controller('/shifts')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ErrorMiddleware)
export class ShiftController {

  constructor (
    private readonly shiftService: ShiftService,
    private readonly shiftCommon: ShiftCommon,
    private readonly collectCommon: CollectCommon,
    private readonly saleCommon: SaleCommon
  ) {}

  @Get()
  @Summary('Return a list of shifts')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ shiftObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<Shift>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    const [shifts, totalDocs] = await Promise.all([
      this.shiftService.getAllAsync(filter),
      this.shiftService.countDocuments(filter)
    ]);
    
    return new Paginator<Shift>(shifts, queryParams, totalDocs).pager();
  }

  @Get('/cut')
  @Summary('Creates a shift cut')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(shiftCutObjectExample) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin)
  async cut(@QueryParams('previous') previous: boolean, @HeaderParams() headers: object): Promise<any> {
    const { id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers));
    const [ shifts, _ ] = await Promise.all([ this.shiftService.getAllAsync(), this.collectCommon.collectAll(id) ]);
      
    const selected = previous ? this.shiftCommon.getPrevious(shifts) : this.shiftCommon.getCurrent(shifts);
    const intervalsUtc = this.shiftCommon.parseDateUTC(selected, previous);
      
    return await this.saleCommon.doReport(intervalsUtc, id);
  }

  @Get('/:id')
  @Summary('Return a specific shift')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(shiftObjectExample) ])
  @(Status(404).Description('Shift not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorShiftExists('_id')
  async getByIdAsync(@PathParams('id') id: string, @QueryParams() queryParams: Parameters): Promise<Shift> {
    const filter = new Filter(queryParams).setRelation().build();
    return await this.shiftService.getByIdAsync(id, filter);
  }

  @Post()
  @Summary('Create a new shift')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(shiftObjectExample) ])
  @(Status(400).Description('Invalid shift'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  async createAsync(@BodyParams() shift: Shift): Promise<Shift> {
    return await this.shiftService.createAsync(shift);
  }

  @Patch('/:id')
  @Summary('Updates existing shift')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(shiftObjectExample) ])
  @(Status(404).Description('Shift not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid shift'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorShiftExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() shift: any): Promise<Shift> {
    return await this.shiftService.updateOneByIdAsync(id, shift);
  }

  @Patch('/:id/add-user')
  @Summary('Add user to the shift')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(shiftObjectExample) ])
  @(Status(404).Description('Shift not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid payload'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorShiftExists('_id')
  async addUser(@PathParams('id') id: string, @BodyParams() body: any): Promise<Shift> {
    return await this.shiftService.updateOneByIdAsync(id, body);
  } 

  @Delete('/:id')
  @Summary('Deletes existing shift')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Shift not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorShiftExists('_id')
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.shiftService.deleteOneByIdAsync(id);
  }
}