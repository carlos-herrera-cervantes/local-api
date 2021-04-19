import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxDto {
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  percentage: number;

}