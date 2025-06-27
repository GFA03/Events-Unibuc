import { EventDto } from '@/features/event/types/eventDto';

export interface DashboardSummaryDto {
  totalEvents: number;
  totalRegistrations: number;
  uniqueParticipants: number;
  recentEvents: EventDto[];
  totalEventsMonthlyTrend: number;
  totalRegistrationsMonthlyTrend: number;
  totalUniqueParticipantsMonthlyTrend: number;
}
