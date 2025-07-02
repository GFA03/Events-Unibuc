import { Event } from '@/features/event/model';
import { CreateEventFormInputs } from '@/features/event/components/CreateEventModal';
import {
  apiCreateEvent,
  apiFetchEvent,
  apiFetchEvents,
  apiFetchMyEvents,
  apiUpdateEvent
} from '@/features/event/api';
import { PaginatedEvents } from '@/features/event/types/PaginatedEventsResponse';
import { EventsQueryParams } from '@/features/event/types/EventsQueryParams';

class EventService {
  async createEvent(event: CreateEventFormInputs, image?: File | null): Promise<Event> {
    const formData = this.prepareEventFormData(event, image);

    const { data } = await apiCreateEvent(formData);

    return Event.fromDto(data);
  }

  async updateEvent(
    id: string,
    event: CreateEventFormInputs,
    image?: File | null,
    removeImage?: boolean
  ): Promise<Event> {
    const formData = this.prepareEventFormData(event, image);

    // Append remove image flag if needed
    if (removeImage) {
      formData.append('removeImage', 'true');
    }

    const { data } = await apiUpdateEvent(id, formData);

    return Event.fromDto(data);
  }

  async fetchEvent(id: string): Promise<Event> {
    const { data } = await apiFetchEvent(id);
    return Event.fromDto(data);
  }

  async fetchEvents(params: EventsQueryParams): Promise<PaginatedEvents> {
    const { data } = await apiFetchEvents(params);
    return {
      events: data.events.map(Event.fromDto),
      total: data.total
    };
  }

  async fetchMyEvents(): Promise<Event[]> {
    const { data } = await apiFetchMyEvents();
    return data.map(Event.fromDto);
  }

  getImageUrl(imageUrl: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return imageUrl ? `${baseUrl}/${imageUrl}` : '';
  }

  private prepareEventFormData(event: CreateEventFormInputs, image?: File | null): FormData {
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

    return formData;
  }
}

export const eventService = new EventService();
