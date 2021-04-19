import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { TaxesService } from '../taxes.service';

@Injectable()
export class ExistsTaxGuard implements CanActivate {

  constructor(private taxesService: TaxesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const tax = await this.taxesService.getByIdAsync(params?.id);

    if (!tax) throw new HttpException('Tax not found', HttpStatus.NOT_FOUND);

    return true;
  }

}