import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  
  @ApiProperty()
  status: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  number: number;

}