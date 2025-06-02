import { Event } from '../../events/entities/event.entity';

export interface EventRegistrationCount {
  eventId: string;
  eventName: string;
  eventDate: Date;
  registrationCount: number;
}

export interface DailyRegistrationCount {
  date: string;
  registrationCount: number;
}

export interface MonthlyRegistrationCount {
  year: number;
  month: number;
  registrationCount: number;
}

export interface DashboardSummary {
  totalEvents: number;
  totalRegistrations: number;
  uniqueParticipants: number;
  recentEvents: Event[];
}
