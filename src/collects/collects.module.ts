import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectsController } from './collects.controller';
import { CollectMoneyService } from './collects.service';
import { CollectMoney, CollectMoneySchema } from './schemas/collect.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: CollectMoney.name, schema: CollectMoneySchema }])
  ],
  controllers: [CollectsController],
  providers: [CollectMoneyService],
  exports: [CollectMoneyService]
})
export class CollectsModule {}