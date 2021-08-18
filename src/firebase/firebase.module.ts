import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { PaymentMethodModule } from '../paymentMethods/paymentMethods.module';
import { StationsModule } from '../stations/stations.module';
import { FirebaseService } from './firebase.service';
import { TaskCreatedListener } from './listeners/task-created.listener';
import { SaleClosedListener } from './listeners/sale-closed.listener';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ProductsModule,
    PaymentMethodModule,
    StationsModule
  ],
  providers: [FirebaseService, TaskCreatedListener, SaleClosedListener],
  exports: [FirebaseService]
})
export class FirebaseModule {}