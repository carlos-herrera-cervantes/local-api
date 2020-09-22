'use strict';

import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IPosition } from '../../Api.Domain/Models/IPosition';
import { Controller, Get, ClassMiddleware, Post, Patch, Delete, Middleware } from '@overnightjs/core';
import { localizer } from '../Middlewares/Localizer';
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { authorize } from '../Middlewares/Authorization';
import { validator } from '../Middlewares/Validator';
import { Roles } from '../../Api.Domain/Constants/Roles';
import { patch } from '../Middlewares/Patch';
import { positionMiddleware } from '../Middlewares/Position';
import { clientMiddleware } from '../Middlewares/Client';
import { shoppingModule } from '../Modules/ShoppingModule';
import { IShopping } from '../../Api.Domain/Models/IShopping';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/positions')
class PositionController {

    private readonly _positionRepository: IRepository<IPosition>;
    private readonly _shoppingRepository: IRepository<IShopping>;

    constructor (positionRepository: IRepository<IPosition>, shoppingRepository: IRepository<IShopping>) {
        this._positionRepository = positionRepository;
        this._shoppingRepository = shoppingRepository;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._positionRepository.countAsync(dto.queryFilter);
        const users = await this._positionRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(positionMiddleware.existsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._positionRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._positionRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Post(':id/shoppings')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(positionMiddleware.existsById)
    @Middleware(clientMiddleware.existsById)
    @ErrorMiddleware
    public async createSaleThroughPosition (request: Request, response: Response): Promise<any> {
        const { body: { clientId }, params: { id }, headers: { userId } } = request;
        const shopping = await shoppingModule.createShoppingObject(clientId, id, userId.toString());
        const result = await this._shoppingRepository.createAsync(shopping);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(positionMiddleware.existsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._positionRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(positionMiddleware.existsById)
    @ErrorMiddleware
    public async deleteByIdAsync (request: Request, response:Response): Promise<any> {
        const { params:{ id } } = request;
        await this._positionRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }
}

export { PositionController };