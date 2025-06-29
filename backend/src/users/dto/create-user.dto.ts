import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    name: 'password',
    description: 'The user password',
    type: String,
    example: '<PASSWORD>',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

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
  @MaxLength(15)
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
}
