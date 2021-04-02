import * as admin from 'firebase-admin';
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
  ValidatePaginationMiddleware,
  ValidateAssignmentShiftMiddleware,
  ValidateSaleClosedMiddleware,
  ValidateProductPayloadMiddleware
} from '../middlewares/ValidatorMiddleware';
import { 
  listDataResponseExample,
  singleDataResponseExample,
  badRequest,
  internalServerError,
  saleObjectExample
} from '../swagger/Examples';
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorSaleExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Sale } from '../models/Sale';
import { SaleService } from '../services/SaleService';
import { PaymentTransactionService } from '../services/PaymentTransactionService';
import { FirebaseService } from '../services/FirebaseService';
import { Filter } from '../models/Filter';
import { User } from '../models/User';
import { Roles } from '../constants/Roles';
import { JsonWebToken } from '../models/JsonWebToken';
import { ShiftCommon } from '../common/ShiftCommon';
import { ShiftService } from '../services/ShiftService';
import { SaleCommon } from '../common/SaleCommon';
import { PaymentTransaction } from '../models/PaymentTransaction';

@Controller('/sales')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ValidateAssignmentShiftMiddleware)
export class SaleController {

  private readonly firebaseDatabase: admin.database.Database;

  constructor(
    private readonly saleService: SaleService,
    private readonly paymentTransactionService: PaymentTransactionService,
    private readonly shiftCommon: ShiftCommon,
    private readonly shiftService: ShiftService,
    private readonly saleCommon: SaleCommon,
    private readonly firebaseService: FirebaseService
  ) {
    this.firebaseDatabase = this.firebaseService.initializeFirebaseApp();
  }

  @Get('/me')
  @Summary('Return a list of sales for specific user in session')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ saleObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  async getAllMeAsync(@QueryParams() queryParams: Parameters, @HeaderParams() headers: object): Promise<Paginator<Sale>> {
    const { _id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as User;
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    filter.criteria.user = _id;
    const [sales, totalDocs] = await Promise.all([
      this.saleService.getAllAsync(filter),
      this.saleService.countDocuments(filter)
    ]);

    return new Paginator<Sale>(sales, queryParams, totalDocs).pager();
  }

  @Get()
  @Summary('Return a list of sales')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ saleObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<Sale>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    const [sales, totalDocs] = await Promise.all([
      this.saleService.getAllAsync(filter),
      this.saleService.countDocuments(filter)
    ]);

    return new Paginator<Sale>(sales, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific sale')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  async getByIdAsync(@PathParams('id') id: string, @QueryParams() queryParams: Parameters): Promise<Sale> {
    const filter = new Filter(queryParams).setRelation().build();
    return await this.saleService.getByIdAsync(id, filter) as Sale;
  }

  @Get('/positions/:id')
  @Summary('Return a list of sales by specific user')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ saleObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getByUserId(
    @HeaderParams() headers: object,
    @PathParams('id') id: string,
    @QueryParams() queryParams: Parameters
  ): Promise<Paginator<Sale>> {
    const { id: userId } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers));
    
    const shifts = await this.shiftService.getAllAsync();
    const currentShift = this.shiftCommon.getCurrent(shifts);
    const { start, end } = this.shiftCommon.parseDateUTC(currentShift);
    const filter = new Filter(queryParams).setPagination().build();
    filter.criteria = {
      createdAt: {
        $gte: start,
        $lte: end
      },
      user: userId,
      status: {
        $in: ['202', '203', '200']
      },
      position: id
    };

    const [sales, totalDocs] = await Promise.all([
      this.saleService.getAllAsync(filter),
      this.saleService.countDocuments(filter)
    ]);

    return new Paginator<Sale>(sales, queryParams, totalDocs).pager();
  }

  @Post()
  @Summary('Create a new sale')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(400).Description('Invalid sale'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin)
  async createAsync(@BodyParams() sale: Sale): Promise<Sale> {
    return await this.saleService.createAsync(sale);
  }

  @Patch('/:id')
  @Summary('Updates existing sale')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid sale'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() sale: any): Promise<Sale> {
    return await this.saleService.updateOneByIdAsync(id, sale);
  }

  @Patch('/:id/products')
  @Summary('Add new product to the sale')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  @UseBefore(ValidateProductPayloadMiddleware)
  async addProduct(@PathParams('id') id: string, @BodyParams() body: any): Promise<Sale> {
    return await this.saleService.updateOneByIdAsync(id, { ...body, status: '202' });
  }

  @Patch('/:id/calculate-total')
  @Summary('Calculates the total of sale')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  async calculateTotal(@PathParams('id') id: string): Promise<Sale> {
    const sale = await this.saleService.getByIdAsync(id) as Sale;
    const total = await this.saleCommon.calculateTotalAsync(sale);
    return await this.saleService.updateOneByIdAsync(id, total);
  }

  @Patch('/:id/pay')
  @Summary('Make a payment to the sale')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  async pay(@PathParams('id') id: string, @BodyParams() body: any): Promise<Sale> {
    const sale = await this.saleService.getByIdAsync(id) as Sale;
    
    const payment = { 
      quantity: sale.total, 
      paymentMethod: body.paymentMethodId
    } as PaymentTransaction;

    const created = await this.paymentTransactionService.createAsync(payment);

    sale.paymentTransaction = created._id;
    sale.status = '203';
    return await this.saleService.saveAsync(sale);
  }

  @Patch('/:id/close')
  @Summary('Passes the sale to the closed state')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(saleObjectExample) ])
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.SuperAdmin, Roles.StationAdmin)
  @ValidatorSaleExists('_id')
  @UseBefore(ValidateSaleClosedMiddleware)
  async close(@PathParams('id') id: string, @HeaderParams() headers: object): Promise<Sale> {
    const { id: userId } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers));
    const sale = await this.saleService.getByIdAsync(id) as Sale;

    sale.status = '201';

    const saleForCloud = await this.saleCommon.createStructureToSendCloud(id);
    await this.firebaseService.insertChildAsync(this.firebaseDatabase, `events/local/sales/${sale._id}`, saleForCloud);

    sale.sendToCloud = true;

    await Promise.all([
      this.saleCommon.chargeMoneyToUser(userId, saleForCloud),
      this.saleService.saveAsync(sale)
    ]);

    return sale;
  }

  @Delete('/:id')
  @Summary('Deletes existing sale')
  @(Status(204).Description('Success'))
  @(Status(404).Description('Sale not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorSaleExists('_id')
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.saleService.deleteOneByIdAsync(id);
  }

}