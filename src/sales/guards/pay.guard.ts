import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { SalesService } from '../sales.service';
import { Sale } from '../schemas/sale.schema';
import { IMongoDBFilter } from '../../base/entities/mongodb-filter.entity';
import { PaymentTransaction } from '../../paymentTransactions/schemas/paymentTransaction.schema';

@Injectable()
export class PayGuard implements CanActivate {

  constructor(private salesService: SalesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, body, query } = context.switchToHttp().getRequest();

    const filter = {
      relation: ['paymentTransaction']
    } as IMongoDBFilter;

    const sale: Sale = await this.salesService.getByIdAsync(params?.id, filter);

    if (sale?.status == '203') {
      throw new HttpException('Sale already paid', HttpStatus.BAD_REQUEST);
    }

    const paymentMethodAlreadyUse = sale?.paymentTransaction
      ?.filter((transaction: PaymentTransaction) =>
        transaction?.paymentMethod as any == body?.paymentMethodId).length != 0;

    if (query?.partial && paymentMethodAlreadyUse) {
      throw new HttpException('Payment method already use', HttpStatus.BAD_REQUEST);
    }

    const quantityPayments = sale?.paymentTransaction
      ?.map((transaction: PaymentTransaction) => transaction?.quantity);

    const partialPaid = !quantityPayments.length ? 0 
      : quantityPayments.reduce((accumulator: number, value: number) => accumulator + value);

    const invalidQuantityToPaid = body?.quantity + partialPaid > sale?.total

    if (invalidQuantityToPaid) {
      throw new HttpException('The amount exceeds the payment', HttpStatus.BAD_REQUEST);
    }

    if (!query?.partial && (body?.quantity + partialPaid) < sale?.total) {
      throw new HttpException('The amount is less than the total', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

}