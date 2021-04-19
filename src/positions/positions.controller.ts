import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { Position } from './schemas/position.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';
import { SalesService } from '../sales/sales.service';
import { AuthService } from '../auth/auth.service';
import { Sale } from '../sales/schemas/sale.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignShiftGuard } from '../shifts/guards/assign-shift.guard';
import { ExistsPositionGuard } from './guards/exists-position.guard';
import { ExistsCustomerGuard } from '../customers/guards/exists-customer.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@UseGuards(AssignShiftGuard)
@Controller('/api/v1/positions')
export class PositionsController {
  
  constructor(
    private positionsService: PositionsService,
    private salesService: SalesService,
    private authService: AuthService
  ) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  async getAllAsync(): Promise<Position[]> {
    return await this.positionsService.getAllAsync();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  @UseGuards(ExistsPositionGuard)
  async getByIdAsync(@Param() params): Promise<Position> {
    return await this.positionsService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() position: CreatePositionDto): Promise<Position> {
    return await this.positionsService.createAsync(position);
  }

  @Post(':id/sales')
  @Roles(Role.SuperAdmin, Role.StationAdmin, Role.Employee)
  @UseGuards(ExistsPositionGuard)
  @UseGuards(ExistsCustomerGuard)
  async createSaleAsync(
    @Body('customerId') customerId: string,
    @Param('id') id: string,
    @Headers('authorization') authorization: string
  ): Promise<Sale> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);
    const sale = await this.salesService.initializeSaleObject(customerId, id, sub);
    return await this.salesService.createAsync(sale);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsPositionGuard)
  async updateByIdAsync(@Param() params, @Body() position: UpdatePositionDto): Promise<Position> {
    return await this.positionsService.updateOneByIdAsync(params.id, position);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsPositionGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<Position> {
    return await this.positionsService.deleteOneByIdAsync(params.id);
  }
}