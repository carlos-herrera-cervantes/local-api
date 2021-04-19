import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentTransactionService } from './paymentTransactions.service';
import { PaymentTransaction, PaymentTransactionSchema } from './schemas/paymentTransaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PaymentTransaction.name, schema: PaymentTransactionSchema }])],
  controllers: [],
  providers: [PaymentTransactionService],
  exports: [PaymentTransactionService]
})
export class PaymentTransactionModule {}