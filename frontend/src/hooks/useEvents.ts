import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';
import apiClient from '@/lib/api';

interface PaginatedEventsResponse {
  data: EventDto[];
  total: number;
}

async function fetchEvents(limit = 10, offset = 0): Promise<{ events: Event[]; total: number }> {
  const response = await apiClient.get<PaginatedEventsResponse>('/events', {
    params: { limit, offset }
  });
  console.log(response.data);
  return {
    events: response.data.data.map(Event.fromDto),
    total: response.data.total
  };
}

interface UseEventsOptions {
  limit?: number;
  offset?: number;
}

export const useEvents = ({ limit = 10, offset = 0 }: UseEventsOptions = {}) => {
  return useQuery({
    queryKey: ['events', limit, offset],
    queryFn: () => fetchEvents(limit, offset),
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
