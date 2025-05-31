// event-response.dto.ts

import { EventType } from '../entities/event-type.enum';
import { TagResponseDto } from '../../tags/dto/tag-response.dto';
import { Event } from '../entities/event.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class EventResponseDto {
  id: string;
  name: string;
  type: EventType;
  description: string;
  location: string;
  organizerId: string;
  organizer: UserResponseDto | null; // Exclude password from the response
  startDateTime: Date;
  endDateTime: Date;
  tags: TagResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(event: Event) {
    this.id = event.id;
    this.name = event.name;
    this.type = event.type;
    this.description = event.description;
    this.location = event.location;
    this.organizerId = event.organizerId;
    this.organizer = UserResponseDto.fromEntity(event.organizer);
    this.startDateTime = event.startDateTime;
    this.endDateTime = event.endDateTime;
    this.tags = event.tags?.map((tag) => TagResponseDto.from(tag)) || [];
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }
}
