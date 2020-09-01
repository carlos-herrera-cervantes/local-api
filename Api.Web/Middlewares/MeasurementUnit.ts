'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IMeasurementUnit } from "../../Api.Domain/Models/IMeasurementUnit";
import { NextFunction, Request, Response} from "express";
import { ResponseDto } from "../Models/Response";
import { resolveRepositories } from '../Config/Container';

class MeasurementUnitMiddleware {

  private readonly _measurementUnitRepository: IRepository<IMeasurementUnit>;

  constructor (measurementUnitRepository: IRepository<IMeasurementUnit>) {
    this._measurementUnitRepository = measurementUnitRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id } } = request;
    const measurement = await this._measurementUnitRepository.getByIdAsync(id, {});

    if (!measurement) return ResponseDto.notFound(false, response, 'MeasurementNotFound');

    next();
  }

}

const measurementUnitMiddleware = new MeasurementUnitMiddleware(resolveRepositories().measurementUnitRepository);

export { measurementUnitMiddleware };