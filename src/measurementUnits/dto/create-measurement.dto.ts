import { ApiProperty } from '@nestjs/swagger';

export class CreateMeasurementDto {
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  short: string;

  @ApiProperty()
  keySat: string;

}