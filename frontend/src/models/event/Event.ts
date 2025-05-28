import { EventDto } from '@/types/event/eventDto';
import { User } from '@/models/user/User';
import { EventType, mapToType } from '@/types/event/eventType';

export class Event {
  public readonly id: string;
  public readonly name: string;
  public readonly type: EventType;
  public readonly description: string;
  // image: string;
  public readonly location: string;
  public readonly organizerId: string;
  public readonly organizer: User;
  public readonly startDateTime: Date;
  public readonly endDateTime: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    type: string,
    description: string,
    location: string,
    organizerId: string,
    organizer: User,
    startDateTime: Date,
    endDateTime: Date,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.type = mapToType(type);
    this.description = description;
    this.location = location;
    this.organizerId = organizerId;
    this.organizer = organizer;
    this.startDateTime = new Date(startDateTime);
    this.endDateTime = new Date(endDateTime);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static fromDto(dto: EventDto) {
    return new Event(
      dto.id,
      dto.name,
      dto.type,
      dto.description,
      dto.location,
      dto.organizerId,
      User.fromDto(dto.organizer),
      new Date(dto.startDateTime),
      new Date(dto.endDateTime),
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }
}
