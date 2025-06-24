import { IsString } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;
}
