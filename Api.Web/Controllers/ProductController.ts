'use strict';

import { ClassMiddleware, Controller, Get, Middleware, Patch } from "@overnightjs/core";
import { Roles } from "../../Api.Domain/Constants/Roles";
import { IProduct } from "../../Api.Domain/Models/IProduct";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { ErrorMiddleware } from "../Decorators/ErrorMiddleware";
import { authorize } from "../Middlewares/Authorization";
import { localizer } from "../Middlewares/Localizer";
import { validator } from "../Middlewares/Validator";
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';
import { productMiddleware } from "../Middlewares/Product";

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/products')
class ProductController {

  private readonly _productRepository: IRepository<IProduct>;

  constructor(productRepository: IRepository<IProduct>) {
    this._productRepository = productRepository;
  }

  @Get()
  @Middleware(authorize.authenticateUser)
  @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
  @Middleware(validator.validatePagination)
  @ErrorMiddleware
  public async getAllAsync(request: Request, response: Response): Promise<any> {
    const { query } = request;
    const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
    const totalDocuments = await this._productRepository.countAsync(dto.queryFilter);
    const products = await this._productRepository.getAllAsync(dto.queryFilter);
    return ResponseDto.ok(true, products, response, query, totalDocuments);
  }

  @Get(':id')
  @Middleware(authorize.authenticateUser)
  @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
  @Middleware(validator.isValidObjectId)
  @Middleware(productMiddleware.existsById)
  @ErrorMiddleware
  public async getByIdAsync(request: Request, response: Response): Promise<any> {
    const { params: { id } } = request;
    const user = await this._productRepository.getByIdAsync(id, {});
    return ResponseDto.ok(true, user, response);
  }

  @Patch(':id')
  @Middleware(authorize.authenticateUser)
  @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
  @Middleware(validator.isValidObjectId)
  @Middleware(productMiddleware.existsById)
  @ErrorMiddleware
  public async updateByIdAsync(request: Request, response: Response): Promise<any> {
    const { params: { id }, body } = request;
    const result = await this._productRepository.updateByIdAsync(id, body);
    return ResponseDto.created(true, result, response);
  }

}

export { ProductController };