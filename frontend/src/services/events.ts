import apiClient from '@/lib/api';
import { Event } from '@/models/event/Event';
import { EventDto } from '@/types/event/eventDto';

export async function getEvents(): Promise<Event[]> {
  const response = await apiClient.get<EventDto[]>('/events');
  return response.data.map(Event.fromDto);
}
