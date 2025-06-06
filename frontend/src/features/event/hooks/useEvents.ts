import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/features/event/service';
import { PaginatedEvents } from '@/features/event/types/PaginatedEventsResponse';

interface EventsQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

export const useEvents = (params: EventsQueryParams = {}) => {
  // Set default values
  const queryParams = {
    limit: 10,
    offset: 0,
    ...params
  };

  return useQuery<PaginatedEvents>({
    queryKey: ['events', queryParams],
    queryFn: () => eventService.fetchEvents(queryParams),
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
