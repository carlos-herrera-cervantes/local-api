import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { MeasurementUnit } from './schemas/measurementUnit.schema';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { MeasurementsService } from './measurements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExistsMeasurementGuard } from './guards/exists-measurement.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/measurement-units')
export class MeasurementsController {
  
  constructor(private measurementsService: MeasurementsService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(): Promise<MeasurementUnit[]> {
    return await this.measurementsService.getAllAsync();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsMeasurementGuard)
  async getByIdAsync(@Param() params): Promise<MeasurementUnit> {
    return await this.measurementsService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() measurement: CreateMeasurementDto): Promise<MeasurementUnit> {
    return await this.measurementsService.createAsync(measurement);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsMeasurementGuard)
  async updateByIdAsync(@Param() params, @Body() measurement: UpdateMeasurementDto): Promise<MeasurementUnit> {
    return await this.measurementsService.updateOneByIdAsync(params.id, measurement);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsMeasurementGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<MeasurementUnit> {
    return await this.measurementsService.deleteOneByIdAsync(params.id);
  }
}