import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class ExistsUserGuard implements CanActivate {

  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const user = await this.usersService.getByIdAsync(params?.id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return true;
  }

}