import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { SalesService } from '../sales.service';
import { Sale } from '../schemas/sale.schema';

@Injectable()
export class CloseGuard implements CanActivate {

  constructor(private salesService: SalesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const sale: Sale = await this.salesService.getByIdAsync(params?.id);

    if (!sale?.products?.length) {
      throw new HttpException('The sale has not products', HttpStatus.BAD_REQUEST);
    }

    if (sale?.status == '202') {
      throw new HttpException('The sale has not been paid', HttpStatus.BAD_REQUEST);
    }

    if (sale?.status == '201') {
      throw new HttpException('Sale already closed', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

}