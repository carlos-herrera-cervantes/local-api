'use strict';

import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { IUser } from "../../Api.Domain/Models/IUser";
import { NextFunction, Request, Response } from "express";
import { ResponseDto } from "../Models/Response";
import {  Request as RequestDto } from '../Models/Request';
import { resolveRepositories } from '../Config/Container';

class UserMiddleware {

  private readonly _userRepository: IRepository<IUser>;

  constructor (userRepository: IRepository<IUser>) {
    this._userRepository = userRepository;
  }

  public async existsById (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { params: { id }} = request;
    const user = await this._userRepository.getByIdAsync(id, {});

    if (!user) return ResponseDto.notFound(false, response, 'UserNotFound');

    next();
  }

  public async existsByEmail (request: Request, response: Response, next: NextFunction): Promise<any> {
    const { body: { email } } = request;
    const dto = new RequestDto({ email }).setCriteria();
    const user = await this._userRepository.getOneAsync(dto.queryFilter);

    if (!user) return ResponseDto.notFound(false, response, 'UserNotFound');

    next();
  }

}

const userMiddleware = new UserMiddleware(resolveRepositories().userRepository);

export { userMiddleware };