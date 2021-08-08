import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponseDto {

  @ApiProperty()
  status: boolean;

}