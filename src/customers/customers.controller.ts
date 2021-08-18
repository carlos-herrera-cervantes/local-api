import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags
} from "@nestjs/swagger";
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from "@nestjs/common";
import { TransformInterceptor } from '../base/interceptors/response.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignShiftGuard } from '../shifts/guards/assign-shift.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CustomersService } from "./customers.service";
import { B2CService } from "../b2c/b2c.service";
import { IMongoDBFilter } from "../base/entities/mongodb-filter.entity";
import { SingleCustomerDto } from "./dto/list-all-customer.dto";
import { FailResponseDto } from '../base/dto/fail-response.dto';
import { Customer } from "./schemas/customer.schema";
import { Role } from "../base/enums/role.enum";
import { Roles } from "../auth/roles.decorator";
import { HttpExceptionFilter } from '../config/exceptions/http-exception.filter';

@ApiTags('Positions')
@ApiProduces('application/json')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/customers')
export class CustomersController {

  constructor(
    private readonly customersService: CustomersService,
    private readonly B2CService: B2CService
  ) {}

  @Get(':customerEmail')
  @ApiOkResponse({ type: SingleCustomerDto, isArray: false })
  @ApiForbiddenResponse({ description: 'Forbidden resource', type: FailResponseDto })
  @ApiNotFoundResponse({ description: 'Resource not found', type: FailResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(AssignShiftGuard)
  @Roles(Role.All)
  async syncCustomerAsync(
    @Param('customerEmail') customerEmail: string
  ): Promise<Customer> {
    const filter = { criteria: { email: customerEmail } } as IMongoDBFilter;
    const [internalCustomer, externalCustomer] = await Promise.all([
      this.customersService.getOneAsync(filter),
      this.B2CService.getUserByEmail(customerEmail)
    ]);

    if (!internalCustomer && !externalCustomer) {
      throw new Error('MissingCustomer');
    }

    if (!externalCustomer) return internalCustomer;

    if (internalCustomer) {
      await this.customersService.deleteOneByIdAsync(internalCustomer._id);
    }

    const newCustomer = {
      firstName: externalCustomer[0]?.first_name,
      lastName: externalCustomer[0]?.last_name,
      gender: externalCustomer[0]?.gender,
      email: externalCustomer[0]?.email,
      _id: externalCustomer[0]?._id['$oid'],
    };

    return await this.customersService.createAsync(newCustomer);
  }

}