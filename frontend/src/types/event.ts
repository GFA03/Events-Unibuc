import {EventDateTime} from "@/types/eventDateTime";

export interface Event {
    id: string;
    name: string;
    type: string;
    description: string;
    image: string;
    location: string;
    organizer: string;
    dateTimes: EventDateTime[];
    createdAt: string;
    updatedAt: string;
}