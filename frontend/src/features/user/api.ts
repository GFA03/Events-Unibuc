import apiClient from '@/lib/api';
import { User } from '@/features/user/model';
import { UserDto } from '@/features/user/types/userDto';
import { OrganizerDto } from '@/features/user/types/organizerDto';
import { UserParams } from '@/features/user/types/userParams';
import { PaginatedUsersResponse } from '@/features/user/types/PaginatedUsers';

export async function fetchUsers(params: UserParams) {
  return apiClient.get<PaginatedUsersResponse>('/users', { params });
}

export async function fetchOrganizer(id: string) {
  return apiClient.get<OrganizerDto>(`/users/organizer/${id}`);
}

export async function apiUpdateUser(id: string, data: Partial<User>) {
  return apiClient.patch<UserDto>(`/users/${id}`, data);
}

export async function apiDeleteUser(id: string) {
  return apiClient.delete(`/users/${id}`);
}
