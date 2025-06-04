import { EventDto } from '@/features/event/types/eventDto';

export interface PaginatedEventsResponse {
  events: EventDto[];
  total: number;
}
