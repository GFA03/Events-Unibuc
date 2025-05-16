import {Event} from '@/models/event/Event';

export interface registrationEventDateTime {
    id: string;
    eventId: string;
    event: Event;
    startDateTime: Date;
    endDateTime: Date;
}