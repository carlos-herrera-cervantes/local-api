import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/products')
export class ProductsController {

  constructor(private productsService: ProductsService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  async getAllAsync(): Promise<Product[]> {
    return await this.productsService.getAllAsync();
  }

  @Get(':id')
  async getByIdAsync(@Param() params): Promise<Product> {
    return await this.productsService.getByIdAsync(params.id);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async updateByIdAsync(@Param() params, @Body() product: UpdateProductDto): Promise<Product> {
    return await this.productsService.updateOneByIdAsync(params.id, product);
  }

}