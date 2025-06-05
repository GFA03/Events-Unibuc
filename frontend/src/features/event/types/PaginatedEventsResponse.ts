import { EventDto } from '@/features/event/types/eventDto';
import { Event } from '@/features/event/model';

export interface PaginatedEventsResponse {
  events: EventDto[];
  total: number;
}

export interface PaginatedEvents {
  events: Event[];
  total: number;
}
