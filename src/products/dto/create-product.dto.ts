import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  pricePublic: number;

  @ApiProperty()
  taxes: string[];

  @ApiProperty()
  measurementUnit: string;

}