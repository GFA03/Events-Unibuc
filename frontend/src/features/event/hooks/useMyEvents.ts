import { useQuery } from '@tanstack/react-query';
import { Event } from '@/features/event/model';
import { eventService } from '@/features/event/service';

export const useMyEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['myEvents'],
    queryFn: eventService.fetchMyEvents,
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
