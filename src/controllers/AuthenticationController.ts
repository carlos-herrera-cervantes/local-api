import { Controller, Post, BodyParams, Context } from "@tsed/common";
import { HttpException } from '../exceptions/HttpException';
import { Summary, Status } from '@tsed/schema';
import { UserService } from '../services/UserService';
import { AppClientService } from '../services/AppClientService';
import { Credentials } from '../models/Credentials';
import { AppClientCredentials } from '../models/AppClientCredentials';
import { AppClient } from '../models/AppClient';
import { User } from '../models/User';
import { sign } from 'jsonwebtoken';
import { okAuthentication, badRequest, internalServerError } from '../swagger/Examples';
import { compare } from 'bcrypt';
import { ValidatorUserExists } from '../decorators/ValidatorDecorator';
import * as R from 'ramda';
import * as parameters from '../../parameters.json';

@Controller('/auth')
export class AuthenticationController {

  constructor(
    private userService: UserService,
    private appClientService: AppClientService
  ) { }

  @Post('/login')
  @Summary('Returns an authentication token')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ okAuthentication])
  @(Status(400).Description('Invalid credentials supplied'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorUserExists('email')
  async login(@BodyParams() credentials: Credentials, @Context() ctx: Context): Promise<string> {
    const user = await this.userService.getOneAsync({ email: credentials.email }) as User;
    const isInvalidPassword = R.not(await compare(credentials.password, user.password));
    const res = ctx.getResponse();

    if (isInvalidPassword) {
      return new HttpException(res.__('InvalidCredentials'), 'InvalidCredentials', res).sendBadRequest();
    }

    const token = sign({ ...user }, parameters.jwt.secret, { expiresIn: '120h' });

    return token;
  }

  @Post('/login-client')
  @Summary('Returns an authentication token')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ okAuthentication])
  @(Status(400).Description('Invalid credentials supplied'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  async loginClient(@BodyParams() credentials: AppClientCredentials, @Context() ctx: Context): Promise<string> {
    const client = await this.appClientService.getOneAsync({ clientId: credentials?.clientId }) as AppClient;
    const isInvalidPassword = client?.clientSecret != credentials?.clientSecret;
    const res = ctx.getResponse();

    if (isInvalidPassword) {
      return new HttpException(res.__('InvalidCredentials'), 'InvalidCredentials', res).sendBadRequest();
    }

    const token = sign({ ...client }, parameters.jwt.secret, { expiresIn: '120h' });

    return token;
  }

  @Post('/logout')
  @Summary('Invalidate session of user')
  @(Status(204).Description('Success'))
  @(Status(400).Description('Missing or invalid token supplied'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  async logout(): Promise<string> {
    return 'OK';
  }

}