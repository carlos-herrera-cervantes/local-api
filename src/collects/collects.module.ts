import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectsController } from './collects.controller';
import { CollectMoneyService } from './collects.service';
import { CollectMoney, CollectMoneySchema } from './schemas/collect.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: CollectMoney.name, schema: CollectMoneySchema }])
  ],
  controllers: [CollectsController],
  providers: [CollectMoneyService],
  exports: [CollectMoneyService]
})
export class CollectsModule {}