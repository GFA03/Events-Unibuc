import {EventDateTime} from "@/types/eventDateTime";
import { EventDateTimeDto } from '@/types/eventDateTimeDto';
import { EventDto } from '@/types/eventDto';

export class Event {
    public readonly id: string;
    public readonly name: string;
    public readonly type: string;
    public readonly description: string;
    // image: string;
    public readonly location: string;
    public readonly organizerId: string;
    public readonly dateTimes: EventDateTime[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(ev: EventDto) {
      this.id = ev.id;
      this.name = ev.name;
      this.type = ev.type;
      this.description = ev.description;
      this.location = ev.location;
      this.organizerId = ev.organizerId;
      this.dateTimes = ev.dateTimes.map((dt: EventDateTimeDto) => new EventDateTime(dt.id, dt.eventId, dt.startDateTime, dt.endDateTime));
      this.createdAt = new Date(ev.createdAt);
      this.updatedAt = new Date(ev.updatedAt);
    }
}