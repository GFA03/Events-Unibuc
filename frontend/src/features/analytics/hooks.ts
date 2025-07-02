import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/features/analytics/service';
import { DashboardSummary } from '@/features/analytics/types/DashboardSummary';
import { EventRegistration } from '@/features/analytics/types/EventRegistration';

export function useOrganizerDashboard() {
  const { data: summary, isError: isSummaryError } = useDashboardSummary();

  const { data: registrationsPerEvent, isError: isRegError } = useEventsRegistrations();

  const { data: monthlyData, isError: isMonthlyError } = useMonthlyRegistrations();

  return {
    summary,
    registrationsPerEvent,
    monthlyData,
    isLoading: !summary || !registrationsPerEvent || !monthlyData,
    isError: isSummaryError || isRegError || isMonthlyError
  };
}
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
