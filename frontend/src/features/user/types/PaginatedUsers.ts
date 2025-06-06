import { User } from '@/features/user/model';
import { UserDto } from '@/features/user/types/userDto';

export interface PaginatedUsers {
  users: User[];
  total: number;
}

export interface PaginatedUsersResponse {
  users: UserDto[];
  total: number;
}
