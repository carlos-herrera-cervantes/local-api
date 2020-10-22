'use strict';

import { Request, Response } from 'express';
import { localizer } from '../Middlewares/Localizer';
import { Controller, Post, ClassMiddleware, Middleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { Request as RequestDto } from '../Models/Request';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ResponseDto } from '../Models/Response';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { IUser } from '../../Api.Domain/Models/IUser';
import { IToken } from '../../Api.Domain/Models/IToken';
import { Token } from '../../Api.Domain/Models/Token';
import { userMiddleware } from '../Middlewares/User';
import { authorize } from '../Middlewares/Authorization';
import * as parameters from '../../parameters.json';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class LoginController {

  private readonly _userRepository: IRepository<IUser>;
  private readonly _tokenRepository: IRepository<IToken>

  constructor (userRepository: IRepository<IUser>, tokenRepository: IRepository<IToken>) {
    this._userRepository = userRepository;
    this._tokenRepository = tokenRepository;
  }

  @Post('login')
  @Middleware(userMiddleware.existsByEmail)
  @ErrorMiddleware
  public async login(request: Request, response: Response): Promise<any> {
    const { body: { email, password } } = request;
    const dto = new RequestDto({ email }).setCriteria();
    const user = await this._userRepository.getOneAsync(dto.queryFilter);
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return ResponseDto.badRequest(false, response, 'InvalidCredentials');
    }

    const token = sign({ email, id: user._id, role: user.role }, parameters.jwt.secret);
    const instance = new Token({ token, email, role: user.role, userId: user._id });
    await this._tokenRepository.createAsync(instance);
    return ResponseDto.ok(true, { token }, response);
  }

  @Post('logout')
  @Middleware(authorize.authenticateUser)
  @ErrorMiddleware
  public async logout (request: Request, response: Response): Promise<any> {
    const { headers: { authorization } } = request;
    const token = authorization.split(' ').pop();
    await this._tokenRepository.deleteManyAsync({ criteria: { token } });

    return ResponseDto.noContent(true, response);
  }

}

export { LoginController };