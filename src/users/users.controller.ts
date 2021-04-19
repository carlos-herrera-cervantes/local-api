import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsUserGuard } from './guards/exists-user.guard';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/users')
export class UsersController {
  
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<User>> {
    const filter = new MongoDBFilter(params).setCriteria().setPagination().setSort().build();
    const [users, totalDocs] = await Promise.all([
      this.usersService.getAllAsync(filter),
      this.usersService.coundDocsAsync(filter)
    ]);

    return new Paginator<User>(users, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsUserGuard)
  async getByIdAsync(@Param() params): Promise<User> {
    return await this.usersService.getByIdAsync(params.id);
  }

  @Post()
  async createAsync(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.createAsync(user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsUserGuard)
  async updateByIdAsync(@Param() params, @Body() user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateOneByIdAsync(params.id, user);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  @UseGuards(ExistsUserGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<User> {
    return await this.usersService.deleteOneByIdAsync(params.id);
  }
}