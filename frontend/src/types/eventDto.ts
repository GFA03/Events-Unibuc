import { EventDateTimeDto } from '@/types/eventDateTimeDto';

export interface EventDto {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  organizerId: string;
  dateTimes: EventDateTimeDto[];
  createdAt: string;
  updatedAt: string;
}