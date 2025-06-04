import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/features/analytics/service';

export function useOrganizerDashboard() {
  const { data: summary, isError: isSummaryError } = useDashboardSummary();

  console.log(summary);
  console.log(isSummaryError);

  const { data: registrationsPerEvent, isError: isRegError } = useEventsRegistrations();

  console.log(registrationsPerEvent);
  console.log(isRegError);

  const { data: monthlyData, isError: isMonthlyError } = useMonthlyRegistrations();

  console.log(monthlyData);
  console.log(isMonthlyError);

  return {
    summary,
    registrationsPerEvent,
    monthlyData,
    isLoading: !summary || !registrationsPerEvent || !monthlyData,
    isError: isSummaryError || isRegError || isMonthlyError
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
