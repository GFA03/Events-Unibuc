import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../events/entities/event.entity';
import { User } from '../entities/user.entity';

export class OrganizerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  organizedEvents: Event[];

  static from(organizer: User): OrganizerResponseDto {
    const dto = new OrganizerResponseDto();
    dto.id = organizer.id;
    dto.firstName = organizer.firstName;
    dto.lastName = organizer.lastName;
    dto.organizedEvents = organizer.organizedEvents || [];
    return dto;
  }
}
