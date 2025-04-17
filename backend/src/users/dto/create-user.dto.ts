import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    description: 'The user email',
    type: String,
    example: '<EMAIL>',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    name: 'password',
    description: 'The user password',
    type: String,
    example: '<PASSWORD>',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    name: 'firstName',
    description: 'The user first name',
    type: String,
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
    description: 'The user last name',
    type: String,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  // TODO: regula pt numar de telefon -> sa aiba 10 cifre, sa inceapa cu 07;
  @ApiProperty({
    name: 'phoneNumber',
    description: 'The user phone number',
    type: String,
    example: '0712345678',
  })
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
}
