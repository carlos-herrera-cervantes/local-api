import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CollectsModule } from '../collects/collects.module';
import { StationsModule } from '../stations/stations.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { AuthModule } from '../auth/auth.module';
import { DatesModule } from '../dates/dates.module';
import { PaymentTransactionModule } from '../paymentTransactions/paymentTransactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    UsersModule,
    ProductsModule,
    CollectsModule,
    StationsModule,
    forwardRef(() => ShiftsModule),
    AuthModule,
    DatesModule,
    PaymentTransactionModule
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}