import {EventDateTimeDto} from "@/types/event/eventDateTimeDto";

export class EventDateTime {
  public readonly id: string;
  public readonly eventId: string;
  public readonly startDateTime: Date;
  public readonly endDateTime: Date;

  private constructor(id: string, eventId: string, startDateTime: Date, endDateTime: Date) {
    this.id = id;
    this.eventId = eventId;
    this.startDateTime = new Date(startDateTime);
    this.endDateTime = new Date(endDateTime);
  }

  public static fromDto(dto: EventDateTimeDto): EventDateTime {
    return new EventDateTime(
        dto.id,
        dto.eventId,
        new Date(dto.startDateTime),
        new Date(dto.endDateTime)
    );
  }
}
