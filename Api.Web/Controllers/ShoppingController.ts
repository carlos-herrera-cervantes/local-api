'use strict';

import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IShopping } from '../../Api.Domain/Models/IShopping';
import { Controller, Get, ClassMiddleware, Post, Patch, Delete, Middleware } from '@overnightjs/core';
import { localizer } from '../Middlewares/Localizer';
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';
import { authorize } from '../Middlewares/Authorization';
import { validator } from '../Middlewares/Validator';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { Roles } from '../../Api.Domain/Constants/Roles';
import { patch } from '../Middlewares/Patch';
import { shoppingMiddleware } from '../Middlewares/Shopping';
import { shoppingModule } from '../Modules/ShoppingModule';
import { IPaymentTransaction } from '../../Api.Domain/Models/IPaymentTransaction';
import { paymentMethodMiddleware } from '../Middlewares/PaymentMethod';
import { PaymentTransaction } from '../../Api.Domain/Models/PaymentTransaction';
import { cloudService } from '../../Api.Client/Services/Cloud';
import R from 'ramda';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/shoppings')
class ShoppingController {

    private readonly _shoppingRepository: IRepository<IShopping>;
    private readonly _paymentTransaction: IRepository<IPaymentTransaction>;

    constructor (shoppingRepository: IRepository<IShopping>, paymentTransaction: IRepository<IPaymentTransaction>) {
        this._shoppingRepository = shoppingRepository;
        this._paymentTransaction = paymentTransaction;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._shoppingRepository.countAsync(dto.queryFilter);
        const users = await this._shoppingRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, query } = request;
        const dto = new RequestDto(query).setRelation();
        const user = await this._shoppingRepository.getByIdAsync(id, dto.queryFilter);
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._shoppingRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._shoppingRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id/products')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @Middleware(validator.validateProduct)
    @ErrorMiddleware
    public async addProduct (request: Request, response: Response): Promise<any> {
        const { body, params: { id } } = request;
        const cloneBody = Object.assign(body, { status: '202' });
        const result = await this._shoppingRepository.updateByIdAsync(id, cloneBody);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id/calculate-total')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @ErrorMiddleware
    public async calculateTotal (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const shopping = await this._shoppingRepository.getByIdAsync(id, {});
        const totalCalculated = await shoppingModule.calculateTotal(shopping);
        const result = await this._shoppingRepository.updateByIdAsync(id, totalCalculated);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id/pay')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @Middleware(paymentMethodMiddleware.existsById)
    @ErrorMiddleware
    public async pay (request: Request, response: Response): Promise<any> {
        const { params: { id }, body: { paymentMethodId } } = request;
        const shopping = await this._shoppingRepository.getByIdAsync(id, {});
        const paymentTransaction = new PaymentTransaction({ quantity: shopping.total, paymentMethodId });
        const created = await this._paymentTransaction.createAsync(paymentTransaction);
        shopping.paymentTransactionId = created._id;
        shopping.status = '203';
        
        const result = await this._shoppingRepository.updateByIdAsync(shopping._id, shopping);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id/close')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @ErrorMiddleware
    public async close (request: Request, response: Response): Promise<any> {
        const { params: { id }} = request;
        const shopping = await this._shoppingRepository.getByIdAsync(id, {});
        shopping.status = '201';

        const shoppingForCloud = await shoppingModule.createStructureToSendCloud(id);
        const responseCloud = await cloudService.createCustomerPurchase(shoppingForCloud);
        shopping.sendToCloud = R.equals(responseCloud, 'OK');

        const result = await this._shoppingRepository.updateByIdAsync(id, shopping);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shoppingMiddleware.existsById)
    @ErrorMiddleware
    public async deleteByIdAsync (request: Request, response: Response): Promise<any> {
        const { params:{ id } } = request;
        await this._shoppingRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }

}

export { ShoppingController };