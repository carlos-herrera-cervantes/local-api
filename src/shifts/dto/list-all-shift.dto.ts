import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

export class PartialShiftDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  monday: string[];

  @ApiProperty()
  tuesday: string[];

  @ApiProperty()
  wednesday: string[];

  @ApiProperty()
  thursday: string[];

  @ApiProperty()
  friday: string[];

  @ApiProperty()
  saturday: string[];

  @ApiProperty()
  sunday: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllShiftDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        name: 'Morning',
        startTime: '07:00:00',
        endTime: '11:59:59',
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  })
  docs: PartialShiftDto[];

}

export class SingleShiftDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialShiftDto;

}

export class ListAllShiftDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllShiftDto;

}