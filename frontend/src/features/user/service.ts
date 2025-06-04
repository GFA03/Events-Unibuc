import { User } from '@/features/user/model';
import { UserDto } from '@/features/user/types/userDto';
import { apiDeleteUser, apiUpdateUser, fetchOrganizer, fetchUsers } from '@/features/user/api';
import { Organizer } from '@/features/user/types/Organizer';

class UserService {
  async getUsers() {
    const { data } = await fetchUsers();
    return data.map((user: UserDto) => User.fromDto(user));
  }

  async getOrganizer(id: string): Promise<Organizer> {
    const { data } = await fetchOrganizer(id);
    if (!data) {
      throw new Error(`Organizer with ID ${id} not found`);
    }
    return Organizer.fromDto(data);
  }

  async updateUser(userId: string, userData: Partial<User>): User {
    const { data } = await apiUpdateUser(userId, userData);
    return User.fromDto(data);
  }

  async deleteUser(userId: string) {
    const { data } = await apiDeleteUser(userId);
    return data;
  }
}

export const userService = new UserService();
