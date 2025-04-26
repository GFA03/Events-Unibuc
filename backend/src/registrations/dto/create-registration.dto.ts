import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({
    description:
      'The UUID of the specific Event Date/Time slot to register for',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsNotEmpty()
  @IsUUID()
  eventDateTimeId: string;
}
