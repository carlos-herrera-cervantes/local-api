import { Controller, Get, Patch, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/products')
export class ProductsController {

  constructor(private productsService: ProductsService) {}

  @Get()
  @Roles(Role.All)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<Product>> {
    const filter = new MongoDBFilter(params)
      .setRelation()
      .setCriteria()
      .setPagination()
      .setSort()
      .build();

    const [products, totalDocs] = await Promise.all([
      this.productsService.getAllAsync(filter),
      this.productsService.countDocsAsync(filter)
    ]);
  
    return new Paginator<Product>(products, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.All)
  async getByIdAsync(@Param() params): Promise<Product> {
    return await this.productsService.getByIdAsync(params.id);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async updateByIdAsync(@Param() params, @Body() product: UpdateProductDto): Promise<Product> {
    return await this.productsService.updateOneByIdAsync(params.id, product);
  }

}