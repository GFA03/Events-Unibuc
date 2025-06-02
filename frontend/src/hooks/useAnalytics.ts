import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { Event } from '@/models/event/Event';

interface DashboardSummary {
  totalEvents: number;
  totalRegistrations: number;
  uniqueParticipants: number;
  recentEvents: Event[];
}

interface EventRegistration {
  eventId: string;
  eventName: string;
  eventDate: string;
  registrationCount: number;
}

export function useOrganizerDashboard() {
  const { data: summary, error: summaryError } = useSWR('/analytics/dashboard/summary', swrFetcher);

  console.log(summary);
  console.log(summaryError);

  const { data: registrationsPerEvent, error: regError } = useSWR(
    '/analytics/dashboard/events/registrations',
    swrFetcher
  );

  console.log(registrationsPerEvent);
  console.log(regError);

  const { data: uniqueParticipants, error: uniqueError } = useSWR(
    '/analytics/dashboard/participants/unique',
    swrFetcher
  );

  console.log(uniqueParticipants);
  console.log(uniqueError);

  const { data: monthlyData, error: monthlyError } = useSWR(
    '/analytics/dashboard/registrations/monthly',
    swrFetcher
  );

  console.log(monthlyData);
  console.log(monthlyError);

  return {
    summary,
    registrationsPerEvent,
    monthlyData,
    isLoading: !summary || !registrationsPerEvent || !monthlyData,
    error: summaryError || regError || monthlyError
  };
}

export function useDailyRegistrations(eventId: string) {
  const { data, error } = useSWR(
    eventId ? `/analytics/dashboard/events/${eventId}/registrations/daily` : null,
    swrFetcher
  );

  return {
    dailyData: data,
    isLoading: !data && !error,
    error
  };
}
