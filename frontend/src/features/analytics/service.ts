import {
  fetchDashboardSummary,
  fetchEventRegistrationsPerDay,
  fetchMonthlyRegistrations,
  fetchRegistrationsPerEvent
} from '@/features/analytics/api';
import { DashboardSummary } from '@/features/analytics/types/DashboardSummary';
import { EventRegistration } from '@/features/analytics/types/EventRegistration';
import { MonthlyRegistrations } from '@/features/analytics/types/MonthlyRegistrations';

class AnalyticsService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const { data } = await fetchDashboardSummary();
    return DashboardSummary.fromDto(data);
  }

  async getRegistrationsPerEvent(): Promise<EventRegistration[]> {
    const { data } = await fetchRegistrationsPerEvent();
    return data;
  }

  async getRegistrationsPerMonth(): Promise<MonthlyRegistrations[]> {
    const { data } = await fetchMonthlyRegistrations();
    return data;
  }

  async getRegistrationsPerDayForEvent(eventId: string | null) {
    if (!eventId) {
      return null;
    }
    const { data } = await fetchEventRegistrationsPerDay(eventId);
    return data;
  }
}

export const analyticsService = new AnalyticsService();
