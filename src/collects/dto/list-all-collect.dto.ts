import { ApiProperty } from "@nestjs/swagger";
import { BaseListDto } from "src/base/dto/base-list.dto";
import { SuccessResponseDto } from "src/base/dto/success-response.dto";

export class PartialCollectDto {

  @ApiProperty()
  user: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class PartialAllCollectDto extends BaseListDto {

  @ApiProperty({
    example: [
      {
        type: 'cash',
        amount: 18,
        user: '607f7e13725ffc34e0f72ecd',
        updateAt: '2021-05-05T18:12:31.000Z',
        updatedAt: '2021-05-05T18:12:31.000Z'
      }
    ]
  })
  docs: PartialCollectDto[];

}

export class SingleCollectDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialCollectDto;

}

export class ListAllCollectDto extends SuccessResponseDto {

  @ApiProperty()
  data: PartialAllCollectDto;

}