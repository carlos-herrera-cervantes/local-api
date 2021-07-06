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
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { TransformInterceptor } from '../base/interceptors/response.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignShiftGuard } from '../shifts/guards/assign-shift.guard';
import { CustomersService } from "./customers.service";
import { ConfigService } from "@nestjs/config";
import { B2CService } from "../b2c/b2c.service";
import { IMongoDBFilter } from "../base/entities/mongodb-filter.entity";
import { SingleCustomerDto } from "./dto/list-all-customer.dto";
import { FailResponseDto } from '../base/dto/fail-response.dto';
import { Customer } from "./schemas/customer.schema";
import { Role } from "../base/enums/role.enum";
import { Roles } from "../auth/roles.decorator";

@ApiTags('Positions')
@ApiProduces('application/json')
@UseGuards(JwtAuthGuard)
@UseGuards(AssignShiftGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/customers')
export class CustomersController {

  constructor(
    private readonly customersService: CustomersService,
    private readonly configService: ConfigService,
    private readonly B2CService: B2CService
  ) {}

  @Get(':customerEmail')
  @ApiOkResponse({ type: SingleCustomerDto, isArray: false })
  @ApiForbiddenResponse({ description: 'Forbidden resource', type: FailResponseDto })
  @ApiNotFoundResponse({ description: 'Resource not found', type: FailResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Roles(Role.All)
  async syncCustomerAsync(
    @Param('customerEmail') customerEmail: string
  ): Promise<Customer> {
    const host = this.configService.get<string>('B2C_HOST');
    const data = {
      email: this.configService.get<string>('B2C_USER'),
      password: this.configService.get<string>('B2C_PASS'),
    };
    const token = await this.B2CService.authAsync(host + '/auth/login', data);
    const filter = { criteria: { email: customerEmail } } as IMongoDBFilter;
    const internalCustomer = await this.customersService.getOneAsync(filter);

    if (!token && !internalCustomer) {
      throw new HttpException('Missing customer', HttpStatus.NOT_FOUND);
    }

    if (!token) return internalCustomer;

    const externalCustomer = await this.B2CService.getAsync(host + `/clients?filter={"email": "${customerEmail}"}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

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