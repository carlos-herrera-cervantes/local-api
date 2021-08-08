import { ApiProperty } from "@nestjs/swagger";
import { BaseListDto } from "src/base/dto/base-list.dto";
import { SuccessResponseDto } from "src/base/dto/success-response.dto";

export class PartialMeasurementDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  short: string;

  @ApiProperty()
  keySat: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllMeasurementDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        name: 'LITER',
        short: 'L',
        keySat: 'LTR',
        updateAt: '2021-04-21T03:04:17.030Z',
        createdAt: '2021-04-21T03:04:17.030Z'
      }
    ]
  })
  docs: PartialMeasurementDto[];

}

export class SingleMeasurementDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialMeasurementDto;

}

export class ListAllMeasurementDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllMeasurementDto;

}