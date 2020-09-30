'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IShift } from "../../Api.Domain/Models/IShift";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';
import { ShiftModule } from "../Modules/ShiftModule";
import moment from "moment";
import R from "ramda";

class ShiftMiddleware {

  private readonly _shiftRepository: IRepository<IShift>;

  constructor (shiftRepository: IRepository<IShift>) {
    this._shiftRepository = shiftRepository;
  }

  public existsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { params: { id }} = request;
    const shift = await this._shiftRepository.getByIdAsync(id, {});

    if (!shift) return ResponseDto.notFound(false, response, 'ShiftNotFound');

    next();
  }

  public isAssignToCurrentShift = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    if (R.equals(request.headers.role, 'SuperAdmin')) return next();

    const shifts = await this._shiftRepository.getAllAsync({});
    const currentShift = ShiftModule.getCurrent(shifts);
    const userId = request.headers.userId;
    const weekDayName = moment.tz(process.env.TIME_ZONE).format('dddd');
    const weekDayShift = currentShift[weekDayName.toLocaleLowerCase()];
    const isAssignUser = weekDayShift.find(id => R.equals(id.toString(), userId));
    
    if (R.isNil(isAssignUser)) return ResponseDto.unauthorize(false, response, 'NotAssignToShift');
    
    request.headers.currentShift = currentShift as any;
    next();
  }

}

const shiftMiddleware = new ShiftMiddleware(resolveRepositories().shiftRepository);

export { shiftMiddleware };