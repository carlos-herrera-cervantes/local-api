import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

export class PartialProductDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  pricePublic: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  taxes: string[];

  @ApiProperty()
  measurementUnit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllProductDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        name: 'Test',
        description: 'Test description',
        price: 10,
        pricePublic: 18,
        taxes: [],
        measurementUnit: '607f97c82f0e153ed032a010',
        type: 'Test',
        createdAt: '2021-01-14T04:50:02.398Z',
        updatedAt: '2021-01-14T04:50:02.398Z'
      }
    ]
  })
  docs: PartialProductDto[];

}

export class SingleProductDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialProductDto;

}

export class ListAllProductDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllProductDto;

}