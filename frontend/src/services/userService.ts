import apiClient from '@/lib/api';
import { User } from '@/models/user/User';

class UserService {
  async fetchUsers() {
    const response = await apiClient.get('/users');
    return response.data.map((user) => User.fromDto(user));
  }

  async updateUser(userId: string, userData: Partial<User>) {
    const response = await apiClient.patch(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  }
}

export const userService = new UserService();
