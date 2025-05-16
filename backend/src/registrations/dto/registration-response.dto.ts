import { ApiProperty } from '@nestjs/swagger';
import { EventDateTime } from '../../events/entities/event-date-time.entity';
import { Registration } from '../entities/registration.entity';

export class RegistrationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventDateTime: EventDateTime;

  @ApiProperty()
  registrationDate: Date;

  static fromEntity(registration: Registration) {
    if (!registration) return null;

    const dto = new RegistrationResponseDto();
    dto.id = registration.id;
    dto.eventDateTime = registration.eventDateTime;
    dto.registrationDate = registration.registrationDate;
    return dto;
  }
}
