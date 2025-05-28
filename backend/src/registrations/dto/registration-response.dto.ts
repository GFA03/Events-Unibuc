import { ApiProperty } from '@nestjs/swagger';
import { Registration } from '../entities/registration.entity';
import { Event } from '../../events/entities/event.entity';

export class RegistrationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  event: Event;

  @ApiProperty()
  registrationDate: Date;

  static fromEntity(registration: Registration) {
    if (!registration) return null;

    if (registration.event === undefined) {
      throw new Error('Event is not populated in the registration entity');
    }

    const dto = new RegistrationResponseDto();
    dto.id = registration.id;
    dto.event = registration.event; // Assuming event is already populated
    dto.registrationDate = registration.registrationDate;
    return dto;
  }
}
