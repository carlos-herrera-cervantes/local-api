'use strict';

import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IMeasurementUnit } from '../../Api.Domain/Models/IMeasurementUnit';
import { Controller, Get, ClassMiddleware, Post, Patch, Delete } from '@overnightjs/core';
import { localizer } from '../Middlewares/Localizer';
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/measurement-units')
class MeasurementUnitController {

    private readonly _measurementUnitRepository: IRepository<IMeasurementUnit>;

    constructor (measurementUnitRepository: IRepository<IMeasurementUnit>) {
        this._measurementUnitRepository = measurementUnitRepository;
    }

    @Get()
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._measurementUnitRepository.countAsync(dto.queryFilter);
        const users = await this._measurementUnitRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._measurementUnitRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._measurementUnitRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._measurementUnitRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    public async deleteByIdAsync (request: Request, response: Response): Promise<any> {
        const { params:{ id } } = request;
        await this._measurementUnitRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }

}

export { MeasurementUnitController };