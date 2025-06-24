import { User } from '@/features/user/model';
import {
  apiChangePassword,
  apiChangePersonalInfo,
  apiDeleteCurrentUser,
  apiDeleteUser,
  apiUpdateUser,
  fetchOrganizer,
  fetchUsers
} from '@/features/user/api';
import { Organizer } from '@/features/user/types/Organizer';
import { PaginatedUsers } from '@/features/user/types/PaginatedUsers';
import { UserParams } from '@/features/user/types/userParams';

class UserService {
  async getUsers(params: UserParams): Promise<PaginatedUsers> {
    const { data } = await fetchUsers(params);
    return { users: data.users.map(User.fromDto), total: data.total };
  }

  async getOrganizer(id: string): Promise<Organizer> {
    const { data } = await fetchOrganizer(id);
    if (!data) {
      throw new Error(`Organizer with ID ${id} not found`);
    }
    return Organizer.fromDto(data);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const { data } = await apiUpdateUser(userId, userData);
    return User.fromDto(data);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await apiChangePassword(currentPassword, newPassword);
    return data;
  }

  async changePersonalInfo(firstName: string, lastName: string, email: string) {
    const { data } = await apiChangePersonalInfo(firstName, lastName, email);
    return data;
  }

  async deleteUser(userId: string) {
    const { data } = await apiDeleteUser(userId);
    return data;
  }

  async deleteCurrentUser() {
    const { data } = await apiDeleteCurrentUser();
    return data;
  }
}

export const userService = new UserService();
