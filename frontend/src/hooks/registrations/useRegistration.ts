import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Registration } from '@/types/registration';

async function fetchRegistration(eventId: string): Promise<Registration> {
  const response = await apiClient.get<Registration>(`/registrations/${eventId}`);
  return response.data;
}

// Used to manage user registrations
export function useRegistration(eventId: string) {
  return useQuery({
    queryKey: ['registration', eventId],
    queryFn: () => fetchRegistration(eventId),
    enabled: !!eventId // Only run the query if eventId is provided
  });
}
