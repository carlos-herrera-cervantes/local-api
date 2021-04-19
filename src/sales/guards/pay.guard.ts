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
export class PayGuard implements CanActivate {

  constructor(private salesService: SalesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const sale: Sale = await this.salesService.getByIdAsync(params?.id);

    if (sale?.status == '203') {
      throw new HttpException('Sale already payed', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

}