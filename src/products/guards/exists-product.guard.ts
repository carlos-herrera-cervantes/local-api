import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class ExistsProductGuard implements CanActivate {

  constructor(private productsService: ProductsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const product = await this.productsService.getByIdAsync(params?.id);

    if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return true;
  }

}