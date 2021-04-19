import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Headers,
  HttpCode
} from '@nestjs/common';
import { Shift } from './schemas/shift.schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftsService } from './shifts.service';
import { AuthService } from '../auth/auth.service';
import { DateService } from '../dates/dates.service';
import { SalesService } from '../sales/sales.service';
import { CollectMoneyService } from '../collects/collects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsShiftGuard } from './guards/exists-shift.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/shifts')
export class ShiftsController {
  
  constructor(
    private shiftsService: ShiftsService,
    private authService: AuthService,
    private collectService: CollectMoneyService,
    private dateService: DateService,
    private salesService: SalesService
  ) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(): Promise<Shift[]> {
    return await this.shiftsService.getAllAsync();
  }

  @Get('cut')
  async cutAsync(
    @Query('previous') previous: boolean,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);
    const [shifts, _] = await Promise.all([
      this.shiftsService.getAllAsync(),
      this.collectService.collectAllAsync(sub)
    ]);

    const localDate = this.dateService.getLocalDate();
    const selected = previous ?
      this.shiftsService.getPrevious(shifts, localDate) :
      this.shiftsService.getCurrent(shifts, localDate);
    const utcIntervals = this.shiftsService.parseDateUTC(selected, previous);

    return await this.salesService.doReportAsync(utcIntervals, sub);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsShiftGuard)
  async getByIdAsync(@Param() params): Promise<Shift> {
    return await this.shiftsService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() shift: CreateShiftDto): Promise<Shift> {
    return await this.shiftsService.createAsync(shift);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsShiftGuard)
  async updateByIdAsync(@Param() params, @Body() shift: UpdateShiftDto): Promise<Shift> {
    return await this.shiftsService.updateOneByIdAsync(params.id, shift);
  }

  @Patch(':id/add-user')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsShiftGuard)
  async addUserAsync(@Param('id') id: string, @Body() shift: UpdateShiftDto): Promise<Shift> {
    return await this.shiftsService.updateOneByIdAsync(id, shift);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsShiftGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<Shift> {
    return await this.shiftsService.deleteOneByIdAsync(params.id);
  }
}