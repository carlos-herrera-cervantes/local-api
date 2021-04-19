import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectDto {
  
  @ApiProperty()
  user: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

}