import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { HashingModule } from '../hashing/hashing.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    HashingModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}