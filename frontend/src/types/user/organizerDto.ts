import { EventDto } from '@/types/event/eventDto';

export interface OrganizerDto {
  id: string;
  firstName: string;
  lastName: string;
  organizedEvents: EventDto[];
}
