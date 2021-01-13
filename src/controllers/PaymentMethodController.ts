import { Controller, Get, PathParams, UseBefore, QueryParams } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorPaymentExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { PaymentMethodService } from '../services/PaymentMethodService';
import { PaymentMethod } from '../models/PaymentMethod';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  paymentMethodObjectExample 
} from '../swagger/Examples';

@Controller('/payment-methods')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ErrorMiddleware)
export class PaymentMethodController {

  constructor(private readonly paymentMethodService: PaymentMethodService) { }
  
  @Get()
  @Summary('Return a list of payment methods')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ paymentMethodObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<PaymentMethod>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [payments, totalDocs] = await Promise.all([
      this.paymentMethodService.getAllAsync(filter),
      this.paymentMethodService.countDocuments(filter)
    ]);

    return new Paginator<PaymentMethod>(payments, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific user')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(paymentMethodObjectExample) ])
  @(Status(404).Description('User not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorPaymentExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<PaymentMethod> {
    return await this.paymentMethodService.getByIdAsync(id);
  }
}