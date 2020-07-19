'use strict';

import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IUser } from '../../Api.Domain/Models/IUser';
import { Controller, Get, ClassMiddleware, Post, Patch, Delete } from '@overnightjs/core';
import { localizer } from '../Middlewares/Localizer';
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class UserController {

    private readonly _userRepository: IRepository<IUser>;

    constructor (userRepository: IRepository<IUser>) {
        this._userRepository = userRepository;
    }

    @Get()
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._userRepository.countAsync(dto.queryFilter);
        const users = await this._userRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._userRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._userRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._userRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    public async deleteByIdAsync (request: Request, response: Response): Promise<any> {
        const { params:{ id } } = request;
        await this._userRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }

}

export { UserController };