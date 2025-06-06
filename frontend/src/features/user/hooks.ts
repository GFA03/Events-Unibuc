import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/user/service';
import { UserParams } from '@/features/user/types/userParams';
import { PaginatedUsers } from '@/features/user/types/PaginatedUsers';

export const useUsers = (params: UserParams = {}) => {
  const queryParams = {
    limit: 10,
    offset: 0,
    ...params
  };

  return useQuery<PaginatedUsers>({
    queryKey: ['users', queryParams],
    queryFn: () => userService.getUsers(queryParams),
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
