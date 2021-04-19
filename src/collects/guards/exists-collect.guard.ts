import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { CollectMoneyService } from '../collects.service';

@Injectable()
export class ExistsCollectGuard implements CanActivate {

  constructor(private collectService: CollectMoneyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const collect = await this.collectService.getByIdAsync(params?.id);

    if (!collect) throw new HttpException('Collect not found', HttpStatus.NOT_FOUND);

    return true;
  }

}