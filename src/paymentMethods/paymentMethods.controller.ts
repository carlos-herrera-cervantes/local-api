import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentMethod } from './schemas/paymentMethod.schema';
import { PaymentMethodService } from './paymentMethods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsPaymentGuard } from './guards/exists-payment.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/payment-methods')
export class PaymentMethodController {

  constructor(private paymentMethodService: PaymentMethodService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  async getAllAsync(): Promise<PaymentMethod[]> {
    return await this.paymentMethodService.getAllAsync();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  @UseGuards(ExistsPaymentGuard)
  async getByIdAsync(@Param() params): Promise<PaymentMethod> {
    return await this.paymentMethodService.getByIdAsync(params.id);
  }

}