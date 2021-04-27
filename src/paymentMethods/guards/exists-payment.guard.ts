import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { PaymentMethodService } from '../paymentMethods.service';

@Injectable()
export class ExistsPaymentGuard implements CanActivate {

  constructor(private paymentMethodService: PaymentMethodService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, body } = context.switchToHttp().getRequest();
    const id = body?.paymentMethodId ?? params?.id;
    const paymentMethod = await this.paymentMethodService.getByIdAsync(id);

    if (!paymentMethod) throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);

    return true;
  }

}