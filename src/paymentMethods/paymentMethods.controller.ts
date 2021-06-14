import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { PaymentMethod } from './schemas/paymentMethod.schema';
import { PaymentMethodService } from './paymentMethods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsPaymentGuard } from './guards/exists-payment.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/payment-methods')
export class PaymentMethodController {

  constructor(private paymentMethodService: PaymentMethodService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<PaymentMethod>> {
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setSort()
      .build();
    
    const [payments, totalDocs] = await Promise.all([
      this.paymentMethodService.getAllAsync(filter),
      this.paymentMethodService.coundDocsAsync(filter)
    ]);
  
    return new Paginator<PaymentMethod>(payments, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  @UseGuards(ExistsPaymentGuard)
  async getByIdAsync(@Param() params): Promise<PaymentMethod> {
    return await this.paymentMethodService.getByIdAsync(params.id);
  }

}