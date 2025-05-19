import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';
import apiClient from '@/lib/api';

async function fetchMyEvents(): Promise<Event[]> {
    const response = await apiClient.get<EventDto[]>('/events/my-events');
    console.log(response.data);
    return response.data.map(Event.fromDto);
}

export const useMyEvents = () => {
    return useQuery<Event[]>({
        queryKey: ['myEvents'],
        queryFn: fetchMyEvents,
        staleTime: 1000 * 60 * 5, // 5 minutes: adjust as needed
    });
};
