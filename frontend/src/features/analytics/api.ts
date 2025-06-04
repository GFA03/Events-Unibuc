import apiClient from '@/lib/api';
import { DashboardSummaryDto } from '@/features/analytics/types/DashboardSummaryDto';
import { EventRegistration } from '@/features/analytics/types/EventRegistration';
import { MonthlyRegistrations } from '@/features/analytics/types/MonthlyRegistrations';
import { DailyRegistrations } from '@/features/analytics/types/DailyRegistrations';

export async function fetchDashboardSummary() {
  return apiClient.get<DashboardSummaryDto>('/analytics/dashboard/summary');
}

export async function fetchRegistrationsPerEvent() {
  return apiClient.get<EventRegistration[]>('/analytics/dashboard/events/registrations');
}

export async function fetchMonthlyRegistrations() {
  return apiClient.get<MonthlyRegistrations[]>('/analytics/dashboard/registrations/monthly');
}

export async function fetchEventRegistrationsPerDay(eventId: string) {
  return apiClient.get<DailyRegistrations[]>(
    `/analytics/dashboard/events/${eventId}/registrations/daily`
  );
}
