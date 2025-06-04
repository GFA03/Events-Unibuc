import { useQuery } from '@tanstack/react-query';
import { Event } from '@/features/event/model';
import { eventService } from '@/features/event/service';

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

  return useQuery<{ events: Event[]; total: number }>({
    queryKey: ['events', queryParams],
    queryFn: () => eventService.fetchEvents(queryParams),
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
