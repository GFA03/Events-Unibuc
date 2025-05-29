import { Event } from '@/models/event/Event';

export interface Registration {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  startDateTime: Date;
  endDateTime: Date;
  registrationDate: Date;
}
