import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { B2CService } from './b2c.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('B2C_HOST'),
        headers: {
          'x-api-key': configService.get<string>('B2C_API_KEY'),
        }
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [B2CService],
  exports: [B2CService]
})
export class B2CModule {}