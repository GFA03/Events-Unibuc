import apiClient from '@/lib/api';
import { EventDto } from '@/features/event/types/eventDto';
import { EventsQueryParams } from '@/features/event/types/EventsQueryParams';
import { PaginatedEventsResponse } from '@/features/event/types/PaginatedEventsResponse';

export async function apiCreateEvent(formData: FormData) {
  return apiClient.post<EventDto>('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export async function apiUpdateEvent(id: string, formData: FormData) {
  return apiClient.patch<EventDto>(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export async function apiFetchEvent(id: string) {
  return apiClient.get<EventDto>(`/events/${id}`);
}

export async function apiFetchEvents(params: EventsQueryParams) {
  return apiClient.get<PaginatedEventsResponse>('/events', { params });
}

export async function apiFetchMyEvents() {
  return apiClient.get<EventDto[]>('/events/my-events');
}
