'use strict';

import { ClassMiddleware, Controller, Get, Middleware } from "@overnightjs/core";
import { Roles } from "../../Api.Domain/Constants/Roles";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { ErrorMiddleware } from "../Decorators/ErrorMiddleware";
import { authorize } from "../Middlewares/Authorization";
import { localizer } from "../Middlewares/Localizer";
import { validator } from "../Middlewares/Validator";
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';
import { IPaymentMethod } from "../../Api.Domain/Models/IPaymentMethod";
import { paymentMethodMiddleware } from "../Middlewares/PaymentMethod";

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/payment-methods')
class PaymentMethodController {

  private readonly _paymentMethodRepository: IRepository<IPaymentMethod>;

  constructor(paymentMethodRepository: IRepository<IPaymentMethod>) {
    this._paymentMethodRepository = paymentMethodRepository;
  }

  @Get()
  @Middleware(authorize.authenticateUser)
  @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
  @Middleware(validator.validatePagination)
  @ErrorMiddleware
  public async getAllAsync(request: Request, response: Response): Promise<any> {
    const { query } = request;
    const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
    const totalDocuments = await this._paymentMethodRepository.countAsync(dto.queryFilter);
    const result = await this._paymentMethodRepository.getAllAsync(dto.queryFilter);
    return ResponseDto.ok(true, result, response, query, totalDocuments);
  }

  @Get(':id')
  @Middleware(authorize.authenticateUser)
  @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
  @Middleware(validator.isValidObjectId)
  @Middleware(paymentMethodMiddleware.existsById)
  @ErrorMiddleware
  public async getByIdAsync(request: Request, response: Response): Promise<any> {
    const { params: { id } } = request;
    const result = await this._paymentMethodRepository.getByIdAsync(id, {});
    return ResponseDto.ok(true, result, response);
  }

}

export { PaymentMethodController };