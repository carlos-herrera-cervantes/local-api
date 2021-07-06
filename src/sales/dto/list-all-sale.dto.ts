import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

class ProductSaleDto {

  @ApiProperty()
  product: string;

  @ApiProperty()
  quantity: number;

}

export class PartialSaleDto {

  @ApiProperty()
  consecutive: number;

  @ApiProperty()
  station: string;

  @ApiProperty()
  folio: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  vat: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  tip: number;

  @ApiProperty()
  totalLetters: number;

  @ApiProperty()
  paymentTransaction: string[];

  @ApiProperty()
  position: string;

  @ApiProperty()
  products: ProductSaleDto[];

  @ApiProperty()
  user: string;

  @ApiProperty()
  customer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllSaleDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        consecutive: 1,
        customer: '607f8b53104a85ef420ef7ea',
        position: '607f8a85ad51923a83f0ae54',
        user: '607f7e13725ffc34e0f72ecd',
        station: '5f947448c83ad110d92cde25',
        folio: 'RE1620670409532',
        status: '200',
        total: 0,
        subtotal: 0,
        vat: 0,
        tip: 0,
        totalLetters: '',
        paymentTransaction: [],
        products: [],
        updateAt: '2021-05-10T18:13:19.000Z',
        createdAt: '2021-05-10T18:13:19.000Z'
      }
    ]
  })
  docs: PartialSaleDto[];

}

export class SingleSaleDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialSaleDto;

}

export class ListAllSaleDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllSaleDto;

}