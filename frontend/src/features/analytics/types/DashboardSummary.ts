import { Event } from '@/features/event/model';
import { DashboardSummaryDto } from '@/features/analytics/types/DashboardSummaryDto';

export class DashboardSummary {
  public readonly totalEvents: number;
  public readonly totalRegistrations: number;
  public readonly uniqueParticipants: number;
  public readonly recentEvents: Event[];

  private constructor(
    totalEvents: number,
    totalRegistrations: number,
    uniqueParticipants: number,
    recentEvents: Event[]
  ) {
    this.totalEvents = totalEvents;
    this.totalRegistrations = totalRegistrations;
    this.uniqueParticipants = uniqueParticipants;
    this.recentEvents = recentEvents;
  }

  public static fromDto(dto: DashboardSummaryDto): DashboardSummary {
    return new DashboardSummary(
      dto.totalEvents,
      dto.totalRegistrations,
      dto.uniqueParticipants,
      dto.recentsEvents ? dto.recentEvents.map((ev) => Event.fromDto(ev)) : []
    );
  }
}
