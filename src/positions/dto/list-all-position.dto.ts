import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

export class PartialPositionDto {

  @ApiProperty()
  status: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  number: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllPositionDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        status: '200',
        name: 'North',
        number: 1,
        updateAt: '2021-04-21T02:12:39.017Z',
        createdAt: '2021-04-21T02:12:39.017Z'
      }
    ]
  })
  docs: PartialPositionDto[];

}

export class SinglePositionDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialPositionDto;

}

export class ListAllPositionDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllPositionDto;

}