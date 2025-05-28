import { Event } from '@/models/event/Event';

export interface Registration {
  id: string;
  eventId: string;
  event: Event;
  startDateTime: Date;
  endDateTime: Date;
  registrationDate: Date;
}
