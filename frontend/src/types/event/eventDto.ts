import { EventDateTimeDto } from '@/types/event/eventDateTimeDto';
import {User} from '@/types/user';

export interface EventDto {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  organizerId: string;
  organizer: User;
  dateTimes: EventDateTimeDto[];
  createdAt: string;
  updatedAt: string;
}