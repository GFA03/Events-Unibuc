import { useQuery } from '@tanstack/react-query';
import { registrationService } from '@/features/registration/service';
import { useAuth } from '@/contexts/AuthContext';

export const useRegistrations = () => {
  return useQuery({
    queryKey: ['myRegistrations'],
    queryFn: registrationService.fetchMyRegistrations,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export const useRegistration = (eventId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['registration', eventId],
    queryFn: () => registrationService.fetchRegistration(eventId),
    enabled: !!eventId && isAuthenticated // Only run the query if eventId is provided
  });
};
