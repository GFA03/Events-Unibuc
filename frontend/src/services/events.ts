import apiClient from '@/lib/api';
import { Event } from '@/types/event';
import { EventDto } from '@/types/eventDto';

export async function getEvents(): Promise<Event[]> {
  const response = await apiClient.get<EventDto[]>('/events');
  return response.data.map((event: EventDto) => new Event(event));
}
