import { ApiProperty } from "@nestjs/swagger";

export class PagerDto {

  @ApiProperty()
  public page: number;

  @ApiProperty()
  public pageSize: number;

  @ApiProperty()
  public remainingDocuments: number;

  @ApiProperty()
  public totalDocuments: number;

}