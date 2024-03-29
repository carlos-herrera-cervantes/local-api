import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { CollectsModule } from './collects/collects.module';
import { MeasurementsModule } from './measurementUnits/measurements.module';
import { PaymentMethodModule } from './paymentMethods/paymentMethods.module';
import { PaymentTransactionModule } from './paymentTransactions/paymentTransactions.module';
import { PositionsModule } from './positions/positions.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { ShiftsModule } from './shifts/shifts.module';
import { StationsModule } from './stations/stations.module';
import { TaxesModule } from './taxes/taxes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FirebaseModule } from './firebase/firebase.module';
import { B2CModule } from './b2c/b2c.module';
import { LoaderShifts } from './hooks/loader-shifts.seed';
import { LoaderPositions } from './hooks/loader-positions.seed';
import { LoaderMeasurements } from './hooks/loader-measurements.seed';
import { LoaderTaxes } from './hooks/loader-taxes.seed';
import { LoaderUsers } from './hooks/loader-users.seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI')
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    CustomersModule,
    CollectsModule,
    MeasurementsModule,
    PaymentMethodModule,
    PaymentTransactionModule,
    PositionsModule,
    ProductsModule,
    SalesModule,
    ShiftsModule,
    StationsModule,
    TaxesModule,
    AuthModule,
    FirebaseModule,
    B2CModule,
  ],
  controllers: [],
  providers: [
    LoaderShifts,
    LoaderPositions,
    LoaderTaxes,
    LoaderMeasurements,
    LoaderUsers,
  ],
})
export class AppModule {}