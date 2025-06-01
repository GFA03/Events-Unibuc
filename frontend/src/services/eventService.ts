import { Event } from '@/models/event/Event';
import apiClient from '@/lib/api';
import { EventDto } from '@/types/event/eventDto';
import { useQuery } from '@tanstack/react-query';
import { CreateEventFormInputs } from '@/components/events/CreateEventModal';

interface PaginatedEventsResponse {
  data: EventDto[];
  total: number;
}

interface EventsQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

class EventService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  async createEvent(event: CreateEventFormInputs, image?: File | null): Promise<Event> {
    const formData = new FormData();

    // Append event data
    Object.entries(event).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append image if provided
    if (image) {
      formData.append('image', image);
    }

    const response = await apiClient.post<EventDto>('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return Event.fromDto(response.data);
  }

  async updateEvent(
    id: string,
    event: CreateEventFormInputs,
    image?: File | null,
    removeImage?: boolean
  ): Promise<Event> {
    const formData = new FormData();

    // Append event data
    Object.entries(event).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append image if provided
    if (image) {
      formData.append('image', image);
    }

    // Append remove image flag if needed
    if (removeImage) {
      formData.append('removeImage', 'true');
    }

    const response = await apiClient.patch(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return Event.fromDto(response.data);
  }

  async fetchEvent(id: string): Promise<Event> {
    const response = await apiClient.get<EventDto>(`/events/${id}`);
    return Event.fromDto(response.data);
  }

  async fetchEvents(params: EventsQueryParams): Promise<{ events: Event[]; total: number }> {
    const response = await apiClient.get<PaginatedEventsResponse>('/events', {
      params
    });
    console.log(response.data);
    return {
      events: response.data.data.map(Event.fromDto),
      total: response.data.total
    };
  }

  async fetchMyEvents(): Promise<Event[]> {
    const response = await apiClient.get<EventDto[]>('/events/my-events');
    console.log(response.data);
    return response.data.map(Event.fromDto);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${this.baseUrl}${imageUrl}`;
  }
}

export const eventService = new EventService();

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => new EventService().fetchEvent(id),
    enabled: !!id // don't fetch until id is available
  });
}

export const useEvents = (params: EventsQueryParams = {}) => {
  // Set default values
  const queryParams = {
    limit: 10,
    offset: 0,
    ...params
  };

  return useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => new EventService().fetchEvents(queryParams),
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};

export const useMyEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['myEvents'],
    queryFn: new EventService().fetchMyEvents,
    staleTime: 1000 * 60 * 5 // 5 minutes: adjust as needed
  });
};
