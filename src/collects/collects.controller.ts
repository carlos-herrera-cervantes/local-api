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
import { CollectMoney } from './schemas/collect.schema';
import { CreateCollectDto } from './dto/create-collect.dto';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { CollectMoneyService } from './collects.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/collects')
export class CollectsController {

  constructor(
    private collectsService: CollectMoneyService,
    private authService: AuthService
  ) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<CollectMoney>> {
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [collects, totalDocs] = await Promise.all([
      this.collectsService.getAllAsync(filter),
      this.collectsService.coundDocsAsync(filter)
    ]);

    return new Paginator<CollectMoney>(collects, params, totalDocs).getPaginator();
  }

  @Get('me')
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  async getMeAsync(
    @Headers('authorization') authorization: string,
    @CustomQueryParams() params: QueryParams
  ): Promise<IPaginatorData<CollectMoney>> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    filter.criteria['user'] = sub;

    const [collects, totalDocs] = await Promise.all([
      this.collectsService.getAllAsync(filter),
      this.collectsService.coundDocsAsync(filter)
    ]);

    return new Paginator<CollectMoney>(collects, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getByIdAsync(@Param() params): Promise<CollectMoney> {
    return await this.collectsService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() collect: CreateCollectDto): Promise<CollectMoney> {
    return await this.collectsService.createAsync(collect);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin)
  async updateByIdAsync(@Param() params, @Body() collect: UpdateCollectDto): Promise<CollectMoney> {
    return await this.collectsService.updateOneByIdAsync(params.id, collect);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<CollectMoney> {
    return await this.collectsService.deleteOneByIdAsync(params.id);
  }
}