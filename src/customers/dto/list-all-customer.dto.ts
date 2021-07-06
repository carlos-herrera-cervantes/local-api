import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/base/dto/success-response.dto";
import { Gender } from "../../base/enums/gender.enum";

export class PartialCustomerDto {

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ default: Gender.Not_Specified_US, enum: Gender })
  gender: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class SingleCustomerDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialCustomerDto;

}