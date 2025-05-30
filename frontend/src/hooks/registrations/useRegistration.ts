import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Registration } from '@/types/registration';
import { useAuth } from '@/contexts/AuthContext';

// Fetch registration for current user and current event
async function fetchRegistration(eventId: string): Promise<Registration> {
  const response = await apiClient.get<Registration>(`/registrations/${eventId}`);
  return response.data;
}

// Used to manage user registrations
export function useRegistration(eventId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['registration', eventId],
    queryFn: () => fetchRegistration(eventId),
    enabled: !!eventId && isAuthenticated // Only run the query if eventId is provided
  });
}
