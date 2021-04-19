import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { CustomersService } from '../customers.service';

@Injectable()
export class ExistsCustomerGuard implements CanActivate {

  constructor(private customerService: CustomersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const customer = await this.customerService.getByIdAsync(body?.customerId);

    if (!customer) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

    return true;
  }

}