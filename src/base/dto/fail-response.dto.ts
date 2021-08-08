import { ApiProperty } from '@nestjs/swagger';

export class FailResponseDto {

  @ApiProperty({ default: false })
  status: boolean;

  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

}
