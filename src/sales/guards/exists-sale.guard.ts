import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { SalesService } from '../sales.service';

@Injectable()
export class ExistsSaleGuard implements CanActivate {

  constructor(private salesService: SalesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const sale = await this.salesService.getByIdAsync(params?.id);

    if (!sale) throw new HttpException('Sale not found', HttpStatus.NOT_FOUND);

    return true;
  }

}