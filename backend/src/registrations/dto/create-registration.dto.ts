import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsUUID()
  eventDateTimeId: string;
}
