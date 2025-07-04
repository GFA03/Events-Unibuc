import { UserDto } from '@/features/user/types/userDto';
import { Tag } from '@/features/tag/types/tag';
import { RegistrationDto } from '@/features/registration/types/registrationDto';

export interface EventDto {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  noParticipants: number | null;
  imageUrl: string;
  imageName: string;
  organizerId: string;
  organizer: UserDto | null;
  startDateTime: string;
  endDateTime: string;
  tags: Tag[];
  registrations: RegistrationDto[];
  createdAt: string;
  updatedAt: string;
}
