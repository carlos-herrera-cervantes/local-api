import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";
import { BaseListDto } from "../../base/dto/base-list.dto";

export class PartialTaxDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllTaxDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        name: 'IVA',
        description: 'Purchase tax',
        status: true,
        percentage: 0.16,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  })
  docs: PartialTaxDto[];

}

export class SingleTaxDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialTaxDto;

}

export class ListAllTaxDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllTaxDto;
  ;
}