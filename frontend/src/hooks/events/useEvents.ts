import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';
import apiClient from '@/lib/api';

interface PaginatedEventsResponse {
  data: EventDto[];
  total: number;
}

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

async function fetchEvents(params: EventsQueryParams): Promise<{ events: Event[]; total: number }> {
  const response = await apiClient.get<PaginatedEventsResponse>('/events', {
    params
  });
  console.log(response.data);
  return {
    events: response.data.data.map(Event.fromDto),
    total: response.data.total
  };
}

export const useEvents = (params: EventsQueryParams = {}) => {
  // Set default values
  const queryParams = {
    limit: 10,
    offset: 0,
    ...params
  };

  return useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
