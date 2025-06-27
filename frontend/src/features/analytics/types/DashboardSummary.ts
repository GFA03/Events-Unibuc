import { Event } from '@/features/event/model';
import { DashboardSummaryDto } from '@/features/analytics/types/DashboardSummaryDto';

export class DashboardSummary {
  public readonly totalEvents: number;
  public readonly totalRegistrations: number;
  public readonly uniqueParticipants: number;
  public readonly recentEvents: Event[];
  public readonly totalEventsMonthlyTrend: number;
  public readonly totalRegistrationsMonthlyTrend: number;
  public readonly totalUniqueParticipantsMonthlyTrend: number;

  private constructor(
    totalEvents: number,
    totalRegistrations: number,
    uniqueParticipants: number,
    recentEvents: Event[],
    totalEventsMonthlyTrend: number,
    totalRegistrationsMonthlyTrend: number,
    totalUniqueParticipantsMonthlyTrend: number
  ) {
    this.totalEvents = totalEvents;
    this.totalRegistrations = totalRegistrations;
    this.uniqueParticipants = uniqueParticipants;
    this.recentEvents = recentEvents;
    this.totalEventsMonthlyTrend = totalEventsMonthlyTrend;
    this.totalRegistrationsMonthlyTrend = totalRegistrationsMonthlyTrend;
    this.totalUniqueParticipantsMonthlyTrend = totalUniqueParticipantsMonthlyTrend;
  }

  public static fromDto(dto: DashboardSummaryDto): DashboardSummary {
    return new DashboardSummary(
      dto.totalEvents,
      dto.totalRegistrations,
      dto.uniqueParticipants,
      dto.recentEvents ? dto.recentEvents.map((ev) => Event.fromDto(ev)) : [],
      dto.totalEventsMonthlyTrend,
      dto.totalRegistrationsMonthlyTrend,
      dto.totalUniqueParticipantsMonthlyTrend
    );
  }
}
