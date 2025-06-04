import { Event } from '@/features/event/model';
import { OrganizerDto } from '@/features/user/types/organizerDto';

export class Organizer {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly organizedEvents: Event[];

  private constructor(id: string, firstName: string, lastName: string, organizedEvents: Event[]) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.organizedEvents = organizedEvents;
  }

  public static fromDto(dto: OrganizerDto): Organizer {
    return new Organizer(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.organizedEvents.map(Event.fromDto)
    );
  }
}
