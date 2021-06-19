import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/base/enums/role.enum';

export class CreateUserDto {
  
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

}