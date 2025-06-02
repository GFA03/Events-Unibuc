import { useQuery } from '@tanstack/react-query';
import { User } from '@/models/user/User';
import { userService } from '@/services/userService';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userService.fetchUsers,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
