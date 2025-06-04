import { EventDto } from '@/features/event/types/eventDto';

export interface OrganizerDto {
  id: string;
  firstName: string;
  lastName: string;
  organizedEvents: EventDto[];
}
