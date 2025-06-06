import { Role } from '../entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    name: 'email',
    description: 'The user email',
    type: String,
    example: '<EMAIL>',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    name: 'firstName',
    description: 'The user first name',
    type: String,
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
    description: 'The user last name',
    type: String,
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    name: 'phoneNumber',
    description: 'The user phone number',
    type: String,
    example: '0712345678',
  })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  readonly role: Role;
}
