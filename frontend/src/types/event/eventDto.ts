import { UserDto } from '@/models/user/userDto';

export interface EventDto {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  organizerId: string;
  organizer: UserDto;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}
