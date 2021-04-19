import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { PositionsService } from '../positions.service';

@Injectable()
export class ExistsPositionGuard implements CanActivate {

  constructor(private positionsService: PositionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const position = await this.positionsService.getByIdAsync(params?.id);

    if (!position) throw new HttpException('Not found position', HttpStatus.NOT_FOUND);

    return true;
  }

}