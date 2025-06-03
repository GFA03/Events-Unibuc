import apiClient from '@/lib/api';

class AnalyticsService {
  async getDashboardSummary() {
    const response = await apiClient.get('/analytics/dashboard/summary');
    return response.data;
  }

  async getRegistrationsPerEvent() {
    const response = await apiClient.get('/analytics/dashboard/events/registrations');
    return response.data;
  }

  async getRegistrationsPerMonth() {
    const response = await apiClient.get('/analytics/dashboard/registrations/monthly');
    return response.data;
  }

  async getRegistrationsPerDayForEvent(eventId: string | null) {
    if (!eventId) {
      return null;
    }
    const response = await apiClient.get(
      `/analytics/dashboard/events/${eventId}/registrations/daily`
    );
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
