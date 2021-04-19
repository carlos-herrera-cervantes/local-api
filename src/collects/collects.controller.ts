import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { CollectMoney } from './schemas/collect.schema';
import { CreateCollectDto } from './dto/create-collect.dto';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { CollectMoneyService } from './collects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/collects')
export class CollectsController {

  constructor(private collectsService: CollectMoneyService) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(): Promise<CollectMoney[]> {
    return await this.collectsService.getAllAsync();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getByIdAsync(@Param() params): Promise<CollectMoney> {
    return await this.collectsService.getByIdAsync(params.id);
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async createAsync(@Body() collect: CreateCollectDto): Promise<CollectMoney> {
    return await this.collectsService.createAsync(collect);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin)
  async updateByIdAsync(@Param() params, @Body() collect: UpdateCollectDto): Promise<CollectMoney> {
    return await this.collectsService.updateOneByIdAsync(params.id, collect);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<CollectMoney> {
    return await this.collectsService.deleteOneByIdAsync(params.id);
  }
}