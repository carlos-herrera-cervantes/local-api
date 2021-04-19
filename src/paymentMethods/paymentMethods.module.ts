import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethodController } from './paymentMethods.controller';
import { PaymentMethodService } from './paymentMethods.service';
import { PaymentMethod, PaymentMethodSchema } from './schemas/paymentMethod.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PaymentMethod.name, schema: PaymentMethodSchema }])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService]
})
export class PaymentMethodModule {}