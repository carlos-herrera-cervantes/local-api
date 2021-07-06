import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

export class PartialPaymentMethodDto {

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllPaymentMethodDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        key: '01',
        name: 'CASH',
        description: 'Cash payment',
        status: true,
        createdAt: '2021-01-16T23:05:32.117Z',
        updatedAt: '2021-01-16T23:05:32.117Z'
      }
    ]
  })
  docs: PartialPaymentMethodDto[];

}

export class SinglePaymentMethodDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialPaymentMethodDto;

}

export class ListAllPaymentMethodDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllPaymentMethodDto;

}