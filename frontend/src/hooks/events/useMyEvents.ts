import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { eventService } from '@/services/eventService';

export const useMyEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['myEvents'],
    queryFn: eventService.fetchMyEvents,
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
