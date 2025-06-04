import { Event } from '@/features/event/model';
import { RegistrationDto } from '@/features/registration/types/registrationDto';

export class Registration {
  public readonly id: string;
  public readonly eventId: string;
  public readonly event: Event | null;
  public readonly userId: string;
  public readonly registrationDate: Date;

  private constructor(
    id: string,
    eventId: string,
    event: Event | null,
    userId: string,
    registrationDate: Date
  ) {
    this.id = id;
    this.eventId = eventId;
    this.event = event;
    this.userId = userId;
    this.registrationDate = registrationDate;
  }

  public static fromDto(dto: RegistrationDto): Registration {
    return new Registration(
      dto.id,
      dto.eventId,
      dto.event ? Event.fromDto(dto.event) : null,
      dto.userId,
      new Date(dto.registrationDate)
    );
  }
}
