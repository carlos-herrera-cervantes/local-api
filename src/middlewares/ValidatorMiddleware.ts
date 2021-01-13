import { EndpointInfo, IMiddleware, Middleware, Req, Context, Next } from '@tsed/common';
import { HttpException } from '../exceptions/HttpException';
import { verify } from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { CollectMoneyService } from '../services/CollectService';
import { CollectCommon } from '../common/CollectCommon';
import { MeasurementUnitService } from '../services/MeasurementUnitService';
import { PaymentMethodService } from '../services/PaymentMethodService';
import { PositionService } from '../services/PositionService';
import { ProductService } from '../services/ProductService';
import { ShiftService } from '../services/ShiftService';
import { ShiftCommon } from '../common/ShiftCommon';
import { JsonWebToken } from '../models/JsonWebToken';
import { SaleService } from '../services/SaleService';
import { TaxService } from '../services/TaxService';
import { CloudService } from '../services/CloudService';
import { ClientService } from '../services/ClientService';
import { Sale } from '../models/Sale';
import { Credentials } from '../models/Credentials';
import { setDTOClientFromB2C } from '../models/Client'
import { ObjectID } from 'mongodb';
import dayjs from 'dayjs';
import * as R from 'ramda';
import * as parameters from '../../parameters.json';
import '../extensions/StringExtensions';

@Middleware()
export class ValidateRoleMiddleware implements IMiddleware {

  /**
   * Validates the user role
   * @param request Request object of Express
   * @param endpoint Array of valid roles
   * @returns If the role there's no exists in the array of roles throw an Forbidden response
   */
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const authorization = R.pathOr('', ['authorization'], request.headers);
    const { role } = verify(R.last(authorization.split(' ')) as string, parameters.jwt.secret) as any;
    const roles = endpoint.get(ValidateRoleMiddleware).roles || [];
    const res = ctx.getResponse();
    
    if (R.not(roles.includes(role))) return new HttpException(res.__('InvalidPermissions'), 'InvalidPermissions', res).sendForbidden();
  }
}

@Middleware()
export class ValidateUserExistsMiddleware implements IMiddleware {

  constructor(private readonly userService: UserService) { }

  /**
   * Validates if user exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If user does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateUserExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));
    
    const res = ctx.getResponse();
    
    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);
    
    const user = await this.userService.getOneAsync(filter);

    if (R.not(user)) return new HttpException(res.__('UserNotFound'), 'UserNotFound', res).sendNotFound();
  }
}

@Middleware()
export class ValidatePaginationMiddleware implements IMiddleware {

  /**
   * Validate if paging parameters are met
   * @param request Request object of Express
   * @param ctx Execution context of request
   * @param next Next call in the stack execution
   * @returns If paging parameters are not met throw an exception
   */
  use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    if (R.isNil(request.query.paginate)) return next();

    const assertions = [ 
      R.isNil(request.query.page),
      R.isNil(request.query.pageSize)
    ].filter(assertion => R.equals(assertion, false)).length;

    const res = ctx.getResponse();
    const missingPagingParams = R.not(R.equals(assertions, 2)) && (request.query.paginate as string || 'false').toBoolean();

    if (missingPagingParams) {
      return new HttpException(res.__('InvalidPaginateNumbers'), 'InvalidPaginateNumbers', res).sendBadRequest();
    }

    next();
  }
}

@Middleware()
export class ValidateClientExistsMiddleware implements IMiddleware {

  constructor(private readonly cloudService: CloudService, private readonly clientService: ClientService) { }

  /**
   * Validates if client exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If client does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateClientExistsMiddleware).fields || [];
    let url: string = parameters?.b2cApi?.host + '/clients';
    
    if (fields.includes('clientId') || fields.includes('_id')) url += `/${request?.body?.clientId}`;

    const fieldsRequest = fields.includes('clientId') ?
      [ request?.body?.clientId ] : fields.includes('_id') ?
      [ request?.params?.id ] : fields.map((field: string) => R.prop(field, request?.body));

    const res = ctx.getResponse();

    if (fields.length != fieldsRequest.length) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const credentials = {
      email: parameters.b2cApi.user,
      password: parameters.b2cApi.password
    } as Credentials;
    const token = await this.cloudService.authenticateAsync(parameters.b2cApi.host + '/auth/login', credentials);
    const B2CClient = await this.cloudService.tryConsultClientAsync(url, token as string);

    if (!B2CClient) {
      const filter: any = {};
      fields.forEach((element: string, index: number) => filter[element == 'clientId' ? '_id' : element] = fieldsRequest[index]);
      const localClient = await this.clientService.getOneAsync(filter);

      if (!localClient) return new HttpException(res.__('ClientNotFound'), 'ClientNotFound', res).sendNotFound();

      return;
    }

    const localClientDto = setDTOClientFromB2C(B2CClient);
    await this.clientService.saveAsync(localClientDto);
  }

}

@Middleware()
export class ValidateCollectExistsMiddleware implements IMiddleware {
  
  constructor(private readonly collectMoneyService: CollectMoneyService) { }

  /**
   * Validates if collect exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If collect does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateCollectExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const collect = await this.collectMoneyService.getOneAsync({ criteria: filter });

    if (R.not(collect)) return new HttpException(res.__('CollectNotFound'), 'CollectNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateQuantityCollectMiddleware implements IMiddleware {

  constructor(private readonly collectCommon: CollectCommon) {}

  /**
   * Validates if collect exists
   * @param request Request object of Express
   * @param ctx Context in which the request is executed
   * @param next Next call in the stack execution
   * @returns If missing collect type or amount is invalid throw a bad request
   */
  async use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    const assertions = [
      R.isNil(request.body.type), 
      R.isNil(request.body.amount)
    ].filter(assertion => assertion == true).length;
    
    const res = ctx.getResponse();

    if (R.gte(assertions, 1)) {
      return new HttpException(res.__('InvalidCollectParams'), 'InvalidCollectParams', res).sendBadRequest();
    }

    await this.collectCommon.collectByType(request.body.user, request.body.type, request.body.amount);

    next();
  }

}

@Middleware()
export class ValidateMeasurementExistsMiddleware implements IMiddleware {

  constructor(private readonly measurementService: MeasurementUnitService) {}

  /**
   * Validates if measurement unit exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If measurement unit does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateMeasurementExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const measurement = await this.measurementService.getOneAsync({ criteria: filter });

    if (R.not(measurement)) return new HttpException(res.__('MeasurementNotFound'), 'MeasurementNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidatePaymentMethodExistsMiddleware implements IMiddleware {

  constructor(private readonly paymentService: PaymentMethodService) {}

  /**
   * Validates if payment method exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If payment method does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidatePaymentMethodExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const payment = await this.paymentService.getOneAsync({ criteria: filter });

    if (R.not(payment)) return new HttpException(res.__('PaymentMethodNotFound'), 'PaymentMethodNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidatePositionExistsMiddleware implements IMiddleware {

  constructor(private readonly positionService: PositionService) {}

  /**
   * Validates if position exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If position does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidatePositionExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const position = await this.positionService.getOneAsync(filter);

    if (R.not(position)) return new HttpException(res.__('PositionNotFound'), 'PositionNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateProductExistsMiddleware implements IMiddleware {

  constructor(private readonly productService: ProductService) {}

  /**
   * Validates if product exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If product does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateProductExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const product = await this.productService.getOneAsync({ criteria: filter });

    if (R.not(product)) return new HttpException(res.__('ProductNotFound'), 'ProductNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateShiftExistsMiddleware implements IMiddleware {

  constructor(private readonly shiftServices: ShiftService) {}

  /**
   * Validates if shift exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If shift does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateShiftExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const shift = await this.shiftServices.getOneAsync({ criteria: filter });

    if (R.not(shift)) return new HttpException(res.__('ShiftNotFound'), 'ShiftNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateAssignmentShiftMiddleware implements IMiddleware {
  
  constructor(private readonly shiftServices: ShiftService, private readonly shiftCommon: ShiftCommon) {}

  /**
   * Validates if current user is assigned to the current shift
   * @param request Request object of Express
   * @param ctx Context in which the request is executed
   * @param next The next call in the stack
   * @returns If user does not assign to the current user throw a forbidden exeception
   */
  async use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    const { role, id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(request.headers));

    if (R.equals(role, 'SuperAdmin')) return next();
    
    const shifts = await this.shiftServices.getAllAsync();
    const currentShift = this.shiftCommon.getCurrent(shifts) as any;
    
    const res = ctx.getResponse();

    if (R.not(currentShift)) return new HttpException(res.__('NotAssignToShift'), 'NotAssignToShift', res).sendForbidden();

    const weekDayName = dayjs().format('dddd');
    const weekDayShift = currentShift[weekDayName.toLocaleLowerCase()];    
    const isAssignUser = weekDayShift.find((user: string) => user == id);

    if (R.isNil(isAssignUser)) return new HttpException(res.__('NotAssignToShift'), 'NotAssignToShift', res).sendForbidden();

    next();
  }
}

@Middleware()
export class ValidateSaleExistsMiddleware implements IMiddleware {

  constructor(private readonly saleService: SaleService) {}

  /**
   * Validates if sale exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If sale does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateSaleExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const sale = await this.saleService.getOneAsync({ criteria: filter });

    if (R.not(sale)) return new HttpException(res.__('SaleNotFound'), 'SaleNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateSaleClosedMiddleware implements IMiddleware {

  constructor(private readonly saleService: SaleService) {}

  /**
   * Validates if sale is already closed
   * @param request Request object of Express
   * @param ctx Context in which the request is executed
   * @param next The next call in the stack
   * @returns If sale is already closed throws an bad request
   */
  async use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    const sale = await this.saleService.getByIdAsync(R.pathOr('', ['params', 'id'], request));
    const res = ctx.getResponse();

    return R.equals(sale.status, '201') ?
      new HttpException(res.__('SaleAlreadyClosed'), 'SaleAlreadyClosed', res).sendBadRequest() :
      next();
  }
}

@Middleware()
export class ValidateTaxExistsMiddleware implements IMiddleware {

  constructor(private readonly taxService: TaxService) {}

  /**
   * Validates if tax exists
   * @param request Request object of Express
   * @param endpoint Filter used to match user
   * @param ctx Context in which the request is executed
   * @returns If tax does not exists throw a not found response
   */
  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    const fields = endpoint.get(ValidateTaxExistsMiddleware).fields || [];
    const fieldsRequest = fields.includes('_id') ? 
      [ R.pathOr('', ['params', 'id'], request) ] : 
      fields.map((field: string) => R.prop(field, request.body));

    const res = ctx.getResponse();

    if (R.not(R.equals(fields.length, fieldsRequest.length))) {
      return new HttpException(res.__('MissingBodyRequestParams'), 'MissingBodyRequestParams', res).sendBadRequest();
    }

    const filter: any = {};
    fields.forEach((element: string, index: number) => filter[element] = fieldsRequest[index]);

    const tax = await this.taxService.getOneAsync(filter);

    if (R.not(tax)) return new HttpException(res.__('TaxNotFound'), 'TaxNotFound', res).sendNotFound();
  }

}

@Middleware()
export class ValidateObjectIDMiddleware implements IMiddleware {

  /**
   * Check if object ID in the path parameters is valid
   * @param request Request object of Express
   * @param ctx Context in which the request is executed
   * @param next The next call in the stack
   * @returns If the object ID is invalid throws a bad request
   */
  async use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    const res = ctx.getResponse();
    const id = R.pathOr('', ['params', 'id'], request);

    return R.not(ObjectID.isValid(id)) ?
      new HttpException(res.__('InvalidObjectId'), 'InvalidObjectId', res).sendBadRequest() :
      next();
  }
}

@Middleware()
export class ValidateProductPayloadMiddleware implements IMiddleware {

  constructor(
    private readonly productService: ProductService,
    private readonly saleService: SaleService
  ) { }

  /**
   * Check if products is the sale has a valid structure
   * @param request Request object of Express
   * @param ctx Context in which the request is executed
   * @param next The next call in the stack
   * @returns If some product has no valid structure throws a bad request
   */
  async use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {
    const res = ctx.getResponse();
    const products = request?.body?.products;

    if (R.not(Array.isArray(products))) {
      return new HttpException(res.__('InvalidPayloadProduct'), 'InvalidPayloadProduct', res).sendBadRequest();
    }

    const sale = await this.saleService.getByIdAsync(request?.params?.id) as Sale;
    const productsIds: string[] = [];

    products.forEach((product: any) => {
      if (R.not(R.hasIn('product', product))) {
        return new HttpException(res.__('InvalidPropertyIdProduct'), 'InvalidPropertyIdProduct', res).sendBadRequest();
      }

      if (R.not(R.hasIn('quantity', product))) {
        return new HttpException(res.__('InvalidPropertyQuantityProduct'), 'InvalidPropertyQuantityProduct', res).sendBadRequest();
      }

      const match = sale.products.find((inner: any) => inner.product ?? '' == product.product ?? '');

      if (match) {
        return new HttpException(res.__('ProductAlreadyAdded'), 'ProductAlreadyAdded', res).sendBadRequest();
      }

      productsIds.push(product?.product);
    });

    const filter = { criteria: { _id: { $in: productsIds } } };
    const result = await this.productService.getAllAsync(filter);

    if (R.not(R.equals(productsIds.length, result.length))) {
      return new HttpException(res.__('InvalidProduct'), 'InvalidProduct', res).sendBadRequest();
    }

    next();
  }
}