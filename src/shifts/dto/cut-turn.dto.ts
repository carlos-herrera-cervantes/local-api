import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "../../base/dto/success-response.dto";

class LabelDto {

  @ApiProperty()
  label: string;

  @ApiProperty()
  amount: number;

}

export class PartialCutTurnDto {

  @ApiProperty()
  products: LabelDto[];

  @ApiProperty()
  payments: LabelDto[];

}

export class SingleCutTurnDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialCutTurnDto;

}