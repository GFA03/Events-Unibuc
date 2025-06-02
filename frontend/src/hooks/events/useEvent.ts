// hooks/useEvent.ts
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.fetchEvent(id),
    enabled: !!id // don't fetch until id is available
  });
}
