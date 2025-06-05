import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @ApiProperty({ description: 'User password', example: '<PASSWORD>' })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak: must contain uppercase, lowercase, number and special character',
    },
  )
  password: string;
}
