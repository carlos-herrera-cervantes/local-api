import { 
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  BodyParams,
  PathParams,
  UseBefore,
  QueryParams,
  HeaderParams
} from "@tsed/common";
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  userObjectExample 
} from '../swagger/Examples';
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorUserExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { JsonWebToken } from '../models/JsonWebToken';
import { Roles } from '../constants/Roles';

@Controller('/users')
@UseBefore(AuthorizeMiddleware)
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('/me')
  @Summary('Return a specific user in session')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample([ userObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin, Roles.Employee)
  @UseBefore(ErrorMiddleware)
  async getMeAsync(@HeaderParams() headers: object): Promise<User> {
    const user = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as User;
    return user;
  }

  @Patch('/me')
  @Summary('Updates specific user in session')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(userObjectExample) ])
  @(Status(400).Description('Invalid user'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin, Roles.StationAdmin, Roles.Employee)
  @UseBefore(ErrorMiddleware)
  async updateMeAsync(@HeaderParams() headers: object, @BodyParams() user: any): Promise<User> {
    const { _id } = JsonWebToken.Deconstruct(JsonWebToken.extractToken(headers)) as User;
    return await this.userService.updateOneByIdAsync(_id, user);
  }
  
  @Get()
  @Summary('Return a list of users')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ userObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin)
  @UseBefore(ErrorMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<User>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [users, totalDocs] = await Promise.all([
      this.userService.getAllAsync(filter),
      this.userService.countDocuments(filter)
    ]);

    return new Paginator<User>(users, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific user')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(userObjectExample) ])
  @(Status(404).Description('User not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin)
  @UseBefore(ErrorMiddleware)
  @ValidatorUserExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<User> {
    return await this.userService.getByIdAsync(id);
  }

  @Post()
  @Summary('Create a new user')
  @(Status(201).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(userObjectExample) ])
  @(Status(400).Description('Invalid user'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.AppClientAdmin, Roles.AppClient)
  @UseBefore(ErrorMiddleware)
  async createAsync(@BodyParams() user: User): Promise<any> {
    return await this.userService.createAsync(user);
  }

  @Patch('/:id')
  @Summary('Updates existing user')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(userObjectExample) ])
  @(Status(404).Description('User not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid user'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin)
  @ValidatorUserExists('_id')
  @UseBefore(ErrorMiddleware)
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() user: any): Promise<User> {
    return await this.userService.updateOneByIdAsync(id, user);
  }

  @Delete('/:id')
  @Summary('Deletes existing user')
  @(Status(204).Description('Success'))
  @(Status(404).Description('User not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.SuperAdmin)
  @ValidatorUserExists('_id')
  @UseBefore(ErrorMiddleware)
  async deleteOneByIdAsync(@PathParams('id') id: string): Promise<string> {
    return await this.userService.deleteOneByIdAsync(id);
  }
}