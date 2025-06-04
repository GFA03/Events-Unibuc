import apiClient from '@/lib/api';
import { User } from '@/features/user/model';
import { UserDto } from '@/features/user/types/userDto';
import { OrganizerDto } from '@/features/user/types/organizerDto';

export async function fetchUsers() {
  return apiClient.get('/users');
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
