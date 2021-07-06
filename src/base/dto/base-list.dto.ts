import { ApiProperty } from "@nestjs/swagger";
import { PagerDto } from "./pager.dto";

export class BaseListDto {

  @ApiProperty()
  paginator: PagerDto;

}