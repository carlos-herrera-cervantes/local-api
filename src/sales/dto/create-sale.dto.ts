import { ApiProperty } from '@nestjs/swagger';
import { ProductSale } from '../schemas/sale.schema';

export class CreateSaleDto {
  
  @ApiProperty()
  tip: number;

  @ApiProperty()
  products: ProductSale[];

  @ApiProperty()
  client: string;

}