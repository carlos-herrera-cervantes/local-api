import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HashingModule } from '../hashing/hashing.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    HashingModule,
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '120h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}