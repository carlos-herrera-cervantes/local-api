import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IShift } from '../../Api.Domain/Models/IShift';
import { Controller, Get, ClassMiddleware, Post, Patch, Delete } from '@overnightjs/core';
import { localizer } from '../Middlewares/Localizer';
import { Request, Response } from 'express';
import { Request as RequestDto } from '../Models/Request';
import { ResponseDto } from '../Models/Response';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/shifts')
class ShiftController {
    private readonly _shiftRepository: IRepository<IShift>;

    constructor (shiftRepository: IRepository<IShift>) {
        this._shiftRepository = shiftRepository;
    }

    @Get()
    public async GetAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._shiftRepository.countAsync(dto.queryFilter);
        const users = await this._shiftRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get(':id')
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._shiftRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._shiftRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._shiftRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    public async deleteByIdAsync (request: Request, response:Response): Promise<any> {
        const { params:{ id } } = request;
        await this._shiftRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }
}

export { ShiftController };