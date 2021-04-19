import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { SalesService } from '../sales.service';
import { ProductsService } from '../../products/products.service';
import { Sale } from '../schemas/sale.schema';
import { ProductSale } from '../schemas/sale.schema';
import { Product } from '../../products/schemas/product.schema';
import { IMongoDBFilter } from '../../base/entities/mongodb-filter.entity';

@Injectable()
export class AddProductGuard implements CanActivate {

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body, params } = context.switchToHttp().getRequest();
    const products = body?.products;

    if (!Array.isArray(products)) {
      throw new HttpException('Invalid payload product', HttpStatus.BAD_REQUEST);
    }

    const sale: Sale = await this.salesService.getByIdAsync(params?.id);
    const productsIds = new Array();

    products.forEach((product: ProductSale) => {
      if (!product?.product) {
        throw new HttpException('Missing product ID', HttpStatus.BAD_REQUEST);
      }

      if (!product?.quantity) {
        throw new HttpException('Missing product quantity', HttpStatus.BAD_REQUEST);
      }

      const match = sale?.products?.find((inner: ProductSale) => inner?.product == product?.product);

      if (match) {
        throw new HttpException('Product already added', HttpStatus.BAD_REQUEST);
      }

      productsIds.push(product?.product);
    });

    const filter = { criteria: { _id: { $in: productsIds } } } as IMongoDBFilter;
    const result: Product[] = await this.productsService.getAllAsync(filter);

    if (productsIds.length != result.length) {
      throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
    }

    return true;
  }

}