import { EventDto } from '@/features/event/types/eventDto';
import { User } from '@/features/user/model';
import { EventType, mapToType } from '@/features/event/types/eventType';
import { Tag } from '@/features/tag/types/tag';
import { Registration } from '@/features/registration/model';

export class Event {
  public readonly id: string;
  public readonly name: string;
  public readonly type: EventType;
  public readonly description: string;
  public readonly imageUrl: string;
  public readonly imageName: string;
  public readonly location: string;
  public readonly organizerId: string;
  public readonly organizer: User | null; // Organizer can be null if not set
  public readonly startDateTime: Date;
  public readonly endDateTime: Date;
  public readonly tags: Tag[];
  public readonly registrations: Registration[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    type: string,
    description: string,
    location: string,
    imageUrl: string,
    imageName: string,
    organizerId: string,
    organizer: User,
    startDateTime: Date,
    endDateTime: Date,
    tags: Tag[],
    registrations: Registration[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.type = mapToType(type);
    this.description = description;
    this.location = location;
    this.imageUrl = imageUrl;
    this.imageName = imageName;
    this.organizerId = organizerId;
    this.organizer = organizer;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.tags = tags;
    this.registrations = registrations;
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
      dto.imageUrl,
      dto.imageName,
      dto.organizerId,
      dto.organizer ? User.fromDto(dto.organizer) : null,
      new Date(dto.startDateTime),
      new Date(dto.endDateTime),
      dto.tags ? dto.tags : [],
      dto.registrations?.map((reg) => Registration.fromDto(reg)) || [],
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }
}
