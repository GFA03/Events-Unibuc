import { useQuery } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';
import apiClient from '@/lib/api';

async function fetchEvents(): Promise<Event[]> {
    const response = await apiClient.get<EventDto[]>('/events');
    console.log(response.data);
    return response.data.map(Event.fromDto);
}

export const useEvents = () => {
    return useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
        staleTime: 1000 * 60 * 5, // 5 minutes: adjust as needed
    });
};
