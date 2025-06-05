import { useQuery } from '@tanstack/react-query';
import { User } from '@/features/user/model';
import { userService } from '@/features/user/service';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export function useOrganizer(id: string) {
  return useQuery({
    queryKey: ['organizer', id],
    queryFn: () => userService.getOrganizer(id),
    enabled: !!id // Only fetch if `id` exists
  });
}
