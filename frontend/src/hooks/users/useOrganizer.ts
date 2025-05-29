import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { OrganizerDto } from '@/types/user/organizerDto';
import { Organizer } from '@/models/user/Organizer';

async function fetchOrganizer(id: string): Promise<Organizer | null> {
  const response = await apiClient.get<OrganizerDto | null>(`/users/organizer/${id}`);
  if (!response.data) {
    return null; // Returns `null` if organizer not found
  }
  return Organizer.fromDto(response.data);
}

export function useOrganizer(id: string) {
  return useQuery({
    queryKey: ['organizer', id],
    queryFn: () => fetchOrganizer(id),
    enabled: !!id // Only fetch if `id` exists
  });
}
