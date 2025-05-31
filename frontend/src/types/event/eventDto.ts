import { UserDto } from '@/models/user/userDto';
import { Tag } from '@/types/tag';

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
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}
