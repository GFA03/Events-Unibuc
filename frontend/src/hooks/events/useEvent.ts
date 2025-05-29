// hooks/useEvent.ts
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';
import apiClient from "@/lib/api";

async function fetchEvent(id: string): Promise<Event> {
    const response = await apiClient.get<EventDto>(`/events/${id}`);
    return Event.fromDto(response.data);
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => fetchEvent(id),
        enabled: !!id, // don't fetch until id is available
    });
}
