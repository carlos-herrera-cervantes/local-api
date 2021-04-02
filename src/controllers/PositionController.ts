import { Controller, Get, Post, Patch, Delete, BodyParams, PathParams, UseBefore, QueryParams, HeaderParams } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorPositionExists, ValidatorClientExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidateAssignmentShiftMiddleware, ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { PositionService } from '../services/PositionService';
import { SaleService } from '../services/SaleService';
import { SaleCommon } from '../common/SaleCommon';
import { Position } from '../models/Position';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { JsonWebToken } from '../models/JsonWebToken';
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  positionObjectExample,
  saleObjectExample
} from '../swagger/Examples';

@Controller('/positions')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ValidateAssignmentShiftMiddleware)
export class PositionController {

  constructor(
    private readonly positionService: PositionService,
    private readonly saleService: SaleService,
    private readonly saleCommon: SaleCommon
  ) { }
  
  @Get()
  @Summary('Return a list of positions')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ positionObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<Position>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [positions, totalDocs] = await Promise.all([
      this.positionService.getAllAsync(filter),
      this.positionService.countDocuments(filter)
    ]);

    return new Paginator<Position>(positions, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific position')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(positionObjectExample) ])
  @(Status(404).Description('Position not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorPositionExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<Position> {
    return await this.positionService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new position')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(positionObjectExample) ])
  @(Status(400).Description('Invalid position'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.StationAdmin, Roles.SuperAdmin)
  async createAsync(@BodyParams() user: Position): Promise<Position> {
    return await this.positionService.createAsync(user);
  }

  @Post('/:id/sales')
  @Summary('Create a new sale in the position')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(400).Description('Invalid data'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorPositionExists('_id')
  @ValidatorClientExists('clientId')
  async createSaleThroughPosition(
    @BodyParams('clientId') clientId: string, 
    @PathParams('id') id: string, 
    @HeaderParams() headers: object
  ): Promise<any> {
    try {
      const { id: userId } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers));
      const sale = await this.saleCommon.initializeSaleObject(clientId, id, userId);
      return await this.saleService.createAsync(sale);
    }
    catch(err) {
      console.error('ERROR: ', err);
      return 'Internal Server Error';
    }
  }

  @Patch('/:id')
  @Summary('Updates existing position')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(positionObjectExample) ])
  @(Status(404).Description('Position not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid position'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorPositionExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() position: any): Promise<Position> {
    return await this.positionService.updateOneByIdAsync(id, position);
  }

  @Delete('/:id')
  @Summary('Deletes existing position')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Position not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorPositionExists('_id')
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.positionService.deleteOneByIdAsync(id);
  }
}