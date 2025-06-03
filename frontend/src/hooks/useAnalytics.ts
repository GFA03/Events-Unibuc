import { Event } from '@/models/event/Event';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Registration } from '@/types/registration';

interface DashboardSummary {
  totalEvents: number;
  totalRegistrations: number;
  uniqueParticipants: number;
  recentEvents: (Event & { registrations: Registration[] })[];
}

export interface EventRegistration {
  eventId: string;
  eventName: string;
  eventDate: string;
  registrationCount: number;
}

export function useOrganizerDashboard() {
  const { data: summary, isError: summaryError } = useDashboardSummary();

  console.log(summary);
  console.log(summaryError);

  const { data: registrationsPerEvent, isError: regError } = useEventsRegistrations();

  console.log(registrationsPerEvent);
  console.log(regError);

  const { data: monthlyData, isError: monthlyError } = useMonthlyRegistrations();

  console.log(monthlyData);
  console.log(monthlyError);

  return {
    summary,
    registrationsPerEvent,
    monthlyData,
    isLoading: !summary || !registrationsPerEvent || !monthlyData,
    isError: summaryError || regError || monthlyError
  };
}

export const useDailyRegistrations = (eventId: string | null) => {
  return useQuery({
    queryKey: ['dailyRegistrations', eventId],
    queryFn: () => analyticsService.getRegistrationsPerDayForEvent(eventId)
  });
};

const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: analyticsService.getDashboardSummary
  });
};

const useEventsRegistrations = () => {
  return useQuery<EventRegistration[]>({
    queryKey: ['eventsRegistrations'],
    queryFn: analyticsService.getRegistrationsPerEvent
  });
};

const useMonthlyRegistrations = () => {
  return useQuery({
    queryKey: ['monthlyRegistrations'],
    queryFn: analyticsService.getRegistrationsPerMonth
  });
};
