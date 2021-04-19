import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  monday: string[];

  @ApiProperty()
  tuesday: string[];

  @ApiProperty()
  wednesday: string[];

  @ApiProperty()
  thursday: string[];

  @ApiProperty()
  friday: string[];

  @ApiProperty()
  saturday: string[];

  @ApiProperty()
  sunday: string[];

}