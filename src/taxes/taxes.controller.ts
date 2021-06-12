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
  HttpCode
} from '@nestjs/common';
import { Tax } from './schemas/tax.schema';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { TaxesService } from './taxes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsTaxGuard } from './guards/exists-tax.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/taxes')
export class TaxesController {
  
  constructor(private taxesService: TaxesService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<Tax>> {
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();
    
    const [taxes, totalDocs] = await Promise.all([
      this.taxesService.getAllAsync(filter),
      this.taxesService.coundDocsAsync(filter)
    ]);
  
    return new Paginator<Tax>(taxes, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsTaxGuard)
  async getByIdAsync(@Param() params): Promise<Tax> {
    return await this.taxesService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() tax: CreateTaxDto): Promise<Tax> {
    return await this.taxesService.createAsync(tax);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsTaxGuard)
  async updateByIdAsync(@Param() params, @Body() tax: UpdateTaxDto): Promise<Tax> {
    return await this.taxesService.updateOneByIdAsync(params.id, tax);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsTaxGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<Tax> {
    return await this.taxesService.deleteOneByIdAsync(params.id);
  }
}