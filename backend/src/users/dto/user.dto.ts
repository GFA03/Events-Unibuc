import { Role } from '../entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  readonly role: Role;
}
