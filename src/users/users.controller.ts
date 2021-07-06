import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
  Headers
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
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
import { ListAllDto, SingleUserDto } from './dto/list-all.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';

@ApiTags('Users')
@ApiConsumes('application/json')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/users')
export class UsersController {
  
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get()
  @ApiResponse({ type: ListAllDto, isArray: false, status: 200 })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<User>> {
    const filter = new MongoDBFilter(params).setCriteria().setPagination().setSort().build();
    const [users, totalDocs] = await Promise.all([
      this.usersService.getAllAsync(filter),
      this.usersService.countDocsAsync(filter)
    ]);

    return new Paginator<User>(users, params, totalDocs).getPaginator();
  }

  @Get('me')
  @ApiResponse({ type: SingleUserDto, isArray: false, status: 200 })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.All)
  async getMeAsync(@Headers('authorization') authorization : string): Promise<User> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);
    return await this.usersService.getByIdAsync(sub);
  }

  @Get(':id')
  @ApiResponse({ type: SingleUserDto, isArray: false, status: 200 })
  @ApiNotFoundResponse({ description: 'Resources not found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsUserGuard)
  async getByIdAsync(@Param() params): Promise<User> {
    return await this.usersService.getByIdAsync(params.id);
  }

  @Post()
  @ApiResponse({ type: SingleUserDto, isArray: false, status: 201 })
  @ApiUnprocessableEntityResponse({ description: 'Invalid model' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async createAsync(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.createAsync(user);
  }

  @Patch(':id')
  @ApiResponse({ type: SingleUserDto, isArray: false, status: 200 })
  @ApiUnprocessableEntityResponse({ description: 'Invalid model' })
  @ApiNotFoundResponse({ description: 'Resources not found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsUserGuard)
  async updateByIdAsync(@Param() params, @Body() user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateOneByIdAsync(params.id, user);
  }

  @Delete(':id')
  @ApiResponse({ isArray: false, status: 204, description: 'No content' })
  @ApiNotFoundResponse({ description: 'Resources not found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.SuperAdmin)
  @UseGuards(ExistsUserGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<User> {
    return await this.usersService.deleteOneByIdAsync(params.id);
  }
}