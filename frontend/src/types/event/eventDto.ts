import { EventDateTimeDto } from '@/types/event/eventDateTimeDto';
import {UserDto} from '@/models/user/userDto';

export interface EventDto {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  organizerId: string;
  organizer: UserDto;
  dateTimes: EventDateTimeDto[];
  createdAt: string;
  updatedAt: string;
}