import { EventDto } from '@/features/event/types/eventDto';

export interface RegistrationDto {
  id: string;
  eventId: string;
  event?: EventDto;
  userId: string;
  registrationDate: Date;
}
