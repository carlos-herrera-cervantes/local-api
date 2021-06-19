import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Headers,
  HttpCode
} from '@nestjs/common';
import { Sale } from './schemas/sale.schema';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';
import { ShiftsService } from '../shifts/shifts.service';
import { AuthService } from '../auth/auth.service';
import { DateService } from '../dates/dates.service';
import { PaymentTransactionService } from '../paymentTransactions/paymentTransactions.service';
import { FirebaseService } from '../firebase/firebase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignShiftGuard } from '../shifts/guards/assign-shift.guard';
import { CalculateTotalGuard } from './guards/calculate-total.guard';
import { PayGuard } from './guards/pay.guard';
import { CloseGuard } from './guards/close.guard';
import { AddProductGuard } from './guards/add-product.guard';
import { ExistsSaleGuard } from './guards/exists-sale.guard';
import { ExistsPositionGuard } from '../positions/guards/exists-position.guard';
import { ExistsPaymentGuard } from '../paymentMethods/guards/exists-payment.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../base/enums/role.enum';
import { MongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { CustomQueryParams, QueryParams } from '../base/entities/query-params.entity';
import { PaymentTransaction } from '../paymentTransactions/schemas/paymentTransaction.schema';
import { Paginator, IPaginatorData } from '../base/entities/paginator.entity';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sales')
@UseGuards(JwtAuthGuard)
@UseGuards(AssignShiftGuard)
@UseInterceptors(TransformInterceptor)
@Controller('/api/v1/sales')
export class SalesController {
  
  constructor(
    private salesService: SalesService,
    private shiftsService: ShiftsService,
    private authService: AuthService,
    private dateService: DateService,
    private paymentTransactionService: PaymentTransactionService,
    private firebaseService: FirebaseService
  ) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  async getAllAsync(@CustomQueryParams() params: QueryParams): Promise<IPaginatorData<Sale>> {
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setRelation()
      .setSort()
      .build();

    const [sales, totalDocs] = await Promise.all([
      this.salesService.getAllAsync(filter),
      this.salesService.countDocsAsync(filter)
    ]);
    
    return new Paginator<Sale>(sales, params, totalDocs).getPaginator();
  }

  @Get('me')
  @Roles(Role.All)
  async getMeAsync(
    @Headers('authorization') authorization: string,
    @CustomQueryParams() params: QueryParams
  ): Promise<IPaginatorData<Sale>> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);
    const filter = new MongoDBFilter(params)
      .setCriteria()
      .setPagination()
      .setRelation()
      .setSort()
      .build();

    filter.criteria['user'] = sub;

    const [sales, totalDocs] = await Promise.all([
      this.salesService.getAllAsync(filter),
      this.salesService.countDocsAsync(filter)
    ]);
      
    return new Paginator<Sale>(sales, params, totalDocs).getPaginator();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsSaleGuard)
  async getByIdAsync(@Param() params): Promise<Sale> {
    return await this.salesService.getByIdAsync(params.id);
  }

  @Get('positions/:id')
  @Roles(Role.All)
  @UseGuards(ExistsPositionGuard)
  async getPendingsAsync(
    @Headers('authorization') authorization : string,
    @Param('id') id: string,
    @CustomQueryParams() params: QueryParams
  ): Promise<IPaginatorData<Sale>> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);

    const shifts = await this.shiftsService.getAllAsync();
    const localDate = this.dateService.getLocalDate();

    const current = this.shiftsService.getCurrent(shifts, localDate);
    const { start, end } = this.shiftsService.parseDateUTC(current);

    const filter = new MongoDBFilter(params)
      .setPagination()
      .setRelation()
      .setSort()
      .build();

    filter.criteria = {
      createdAt: {
        $gte: start,
        $lte: end
      },
      user: sub,
      status: {
        $in: ['202', '203', '200']
      },
      position: id
    };

    const [sales, totalDocs] = await Promise.all([
      this.salesService.getAllAsync(filter),
      this.salesService.countDocsAsync(filter)
    ]);

    return new Paginator<Sale>(sales, params, totalDocs).getPaginator();
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsSaleGuard)
  async updateByIdAsync(@Param() params, @Body() sale: UpdateSaleDto): Promise<Sale> {
    return await this.salesService.updateOneByIdAsync(params.id, sale);
  }

  @Patch(':id/products')
  @Roles(Role.All)
  @UseGuards(ExistsSaleGuard)
  @UseGuards(AddProductGuard)
  async addProductAsync(@Param('id') id : string, @Body() sale: UpdateSaleDto): Promise<Sale> {
    return await this.salesService.updateOneByIdAsync(id, { ...sale, status: '202' });
  }

  @Patch(':id/calculate-total')
  @Roles(Role.All)
  @UseGuards(ExistsSaleGuard)
  @UseGuards(CalculateTotalGuard)
  async calculateTotalAsync(@Param('id') id: string): Promise<Sale> {
    const sale = await this.salesService.getByIdAsync(id);
    const total = await this.salesService.calculateTotalAsync(sale);
    return await this.salesService.updateOneByIdAsync(id, total);
  }

  @Patch(':id/pay')
  @Roles(Role.All)
  @UseGuards(ExistsSaleGuard)
  @UseGuards(PayGuard)
  @UseGuards(ExistsPaymentGuard)
  async payAsync(
    @Param('id') id: string,
    @Body() body,
    @CustomQueryParams() params: QueryParams
  ): Promise<Sale> {
    const sale = await this.salesService.getByIdAsync(id) as Sale;
    const payment = {
      quantity: params?.partial ? body?.quantity : sale?.total,
      paymentMethod: body?.paymentMethodId
    } as PaymentTransaction;
    const created = await this.paymentTransactionService.createAsync(payment);

    sale.paymentTransaction.push(created._id);
    params?.partial ? false : sale.status = '203';

    return await this.salesService.saveAsync(sale);
  }

  @Patch(':id/close')
  @Roles(Role.All)
  @UseGuards(ExistsSaleGuard)
  @UseGuards(CloseGuard)
  async closeAsync(
    @Headers('authorization') authorization: string,
    @Param('id') id: string
  ): Promise<Sale> {
    const token = authorization?.split(' ').pop();
    const { sub } = await this.authService.getPayload(token);

    const [sale, saleCloud] = await Promise.all([
      this.salesService.getByIdAsync(id),
      this.salesService.createCloudStructure(id)
    ]);
    const cloud = await this.firebaseService.tryInsertChildAsync(
      `events/local/sales/${id}`,
      saleCloud,
      this.firebaseService.initializeApp()
    );

    sale.status = '201';
    cloud ? sale.sendToCloud = true : sale.sendToCloud = false;

    await Promise.all([
      this.salesService.chargeMoneyToUser(sub, saleCloud),
      this.salesService.saveAsync(sale)
    ]);

    return sale;
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.StationAdmin)
  @UseGuards(ExistsSaleGuard)
  @HttpCode(204)
  async deleteByIdAsync(@Param() params): Promise<Sale> {
    return await this.salesService.deleteOneByIdAsync(params.id);
  }
}