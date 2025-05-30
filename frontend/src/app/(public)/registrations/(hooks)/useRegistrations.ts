import apiClient from '@/lib/api';
import { Registration } from '@/types/registration';
import { useQuery } from '@tanstack/react-query';

async function fetchUserRegistrationsClient(): Promise<Registration[]> {
  const response = await apiClient.get('/registrations/my');
  return response.data;
}

export const useRegistrations = () => {
  return useQuery({
    queryKey: ['myRegistrations'],
    queryFn: fetchUserRegistrationsClient,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
