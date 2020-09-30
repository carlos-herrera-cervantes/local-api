import { IRepository } from '../../Api.Repository/Repositories/IRepository'
import { IShift } from '../../Api.Domain/Models/IShift';
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
import { shiftMiddleware } from '../Middlewares/Shift';
import '../Extensions/StringExtensions';
import '../Extensions/ArrayExtensions';
import { shoppingModule } from '../Modules/ShoppingModule';
import { collectModule } from '../Modules/CollectModule';

@ClassMiddleware(localizer.configureLanguages)
@ClassMiddleware(authorize.authenticateUser)
@Controller('api/v1/shifts')
class ShiftController {
    private readonly _shiftRepository: IRepository<IShift>;

    constructor (shiftRepository: IRepository<IShift>) {
        this._shiftRepository = shiftRepository;
    }

    @Get()
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async GetAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._shiftRepository.countAsync(dto.queryFilter);
        const users = await this._shiftRepository.getAllAsync(dto.queryFilter);
        
        return ResponseDto.ok(true, users, response, query, totalDocuments);
    }

    @Get('cut')
    @Middleware(validator.validateRole(Roles.Employee))
    @ErrorMiddleware
    public async cut (request: Request, response: Response): Promise<any> {
        const { query: { previous }, headers: { userId } } = request;
        const isPrevious = (previous as string || 'false').toBoolean();
        const [ shifts, _ ] = await Promise.all([ this._shiftRepository.getAllAsync({}), collectModule.collectAll(userId as string) ]);
        const selected = isPrevious ? shifts.getPrevious() : shifts.getCurrent();
        const intervalsUtc = selected.getIntervalsUtc(isPrevious);
        const report = await shoppingModule.doReport(intervalsUtc, userId as string);

        return ResponseDto.created(true, report, response);
    }

    @Get(':id')
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shiftMiddleware.existsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._shiftRepository.getByIdAsync(id, {});
        return ResponseDto.ok(true, user, response);
    }

    @Post()
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        const result = await this._shiftRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shiftMiddleware.existsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._shiftRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id/add-user')
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shiftMiddleware.existsById)
    @ErrorMiddleware
    public async addUser (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._shiftRepository.updateByIdAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(validator.validateRole(Roles.StationAdmin, Roles.SuperAdmin))
    @Middleware(validator.isValidObjectId)
    @Middleware(shiftMiddleware.existsById)
    @ErrorMiddleware
    public async deleteByIdAsync (request: Request, response:Response): Promise<any> {
        const { params:{ id } } = request;
        await this._shiftRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }
}

export { ShiftController };