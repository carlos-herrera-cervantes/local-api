'use strict';

import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { ICollectMoney } from '../../Api.Domain/Models/ICollectMoney';
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
import { collectMiddleware } from '../Middlewares/Collect';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/collects')
class CollectController {

    private readonly _collectRepository: IRepository<ICollectMoney>;

    constructor (collectRepository: IRepository<ICollectMoney>) {
        this._collectRepository = collectRepository;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._collectRepository.countAsync(dto.queryFilter);
        const users = await this._collectRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(collectMiddleware.existsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._collectRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._collectRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(collectMiddleware.existsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._collectRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(collectMiddleware.existsById)
    @ErrorMiddleware
    public async deleteByIdAsync (request: Request, response: Response): Promise<any> {
        const { params:{ id } } = request;
        await this._collectRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }
}

export { CollectController };