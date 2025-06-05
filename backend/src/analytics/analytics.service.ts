import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from '../registrations/entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import {
  DailyRegistrationCount,
  DashboardSummary,
  EventRegistrationCount,
  MonthlyRegistrationCount,
} from './dto/analytics.dto';
import { AuthorizedUser } from '../auth/types/AuthorizedUser';
import { Role } from '../users/entities/role.enum';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  // Number of registrations for each event
  async getRegistrationsPerEvent(
    organizerId: string,
  ): Promise<EventRegistrationCount[]> {
    this.logger.log(
      `Fetching registration counts for events of organizer ${organizerId}`,
    );
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.registrations', 'registration')
      .select([
        'event.id as eventId',
        'event.name as eventName',
        'event.startDateTime as eventDate',
        'COUNT(registration.id) as registrationCount',
      ])
      .where('event.organizerId = :organizerId', { organizerId })
      .groupBy('event.id, event.name, event.startDateTime')
      .orderBy('event.startDateTime', 'DESC')
      .getRawMany();
  }

  // Unique participants for all events (organizer level)
  async getUniqueParticipantsForAllEvents(
    organizerId: string,
  ): Promise<number> {
    this.logger.log(
      `Calculating unique participants for all events of organizer ${organizerId}`,
    );
    const result = await this.registrationRepository
      .createQueryBuilder('registration')
      .innerJoin('registration.event', 'event')
      .select('COUNT(DISTINCT registration.userId)', 'uniqueParticipants')
      .where('event.organizerId = :organizerId', { organizerId })
      .getRawOne();

    this.logger.debug('Unique participants result: ', result);

    if (!result || !result.uniqueParticipants) {
      return 0; // No registrations found
    }

    return parseInt(result.uniqueParticipants) || 0;
  }

  // Number of registrations per day for a specific event
  async getRegistrationsPerDay(
    eventId: string,
    user: AuthorizedUser,
  ): Promise<DailyRegistrationCount[]> {
    this.logger.log(`Fetching daily registration counts for event ${eventId}`);

    const event = await this.eventRepository.findOne({
      where: { id: eventId, organizerId: user.id },
    });

    if (!event) {
      this.logger.warn(`Event not found: ${eventId}`);
      throw new NotFoundException('Event not found!');
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      this.logger.warn(
        `Unauthorized access: Event ${eventId} does not belong to organizer ${user.id}`,
      );
      throw new UnauthorizedException(
        "You are not authorized to access this event's analytics.",
      );
    }

    return this.registrationRepository
      .createQueryBuilder('registration')
      .select([
        'DATE(registration.registrationDate) as date',
        'COUNT(registration.id) as registrationCount',
      ])
      .where('registration.eventId = :eventId', { eventId })
      .groupBy('DATE(registration.registrationDate)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  // Registrations per month for organizer
  async getRegistrationsPerMonth(
    organizerId: string,
    year?: number,
  ): Promise<MonthlyRegistrationCount[]> {
    this.logger.log(
      `Fetching monthly registration counts for organizer ${organizerId} in year ${year}`,
    );
    let query = this.registrationRepository
      .createQueryBuilder('registration')
      .innerJoin('registration.event', 'event')
      .select([
        'YEAR(registration.registrationDate) as year',
        'MONTH(registration.registrationDate) as month',
        'COUNT(registration.id) as registrationCount',
      ])
      .where('event.organizerId = :organizerId', { organizerId });

    if (year) {
      query = query.andWhere('YEAR(registration.registrationDate) = :year', {
        year,
      });
    }

    return query
      .groupBy(
        'YEAR(registration.registrationDate), MONTH(registration.registrationDate)',
      )
      .orderBy('year, month', 'ASC')
      .getRawMany();
  }

  // Dashboard summary statistics
  async getDashboardSummary(organizerId: string): Promise<DashboardSummary> {
    this.logger.log(`Fetching dashboard summary for organizer ${organizerId}`);
    const [totalEvents, totalRegistrations, uniqueParticipants, recentEvents] =
      await Promise.all([
        this.getTotalEvents(organizerId),
        this.getTotalRegistrations(organizerId),
        this.getUniqueParticipantsForAllEvents(organizerId),
        this.getRecentEvents(organizerId, 5),
      ]);

    return {
      totalEvents,
      totalRegistrations,
      uniqueParticipants,
      recentEvents,
    };
  }

  private async getTotalEvents(organizerId: string): Promise<number> {
    return this.eventRepository.count({ where: { organizerId } });
  }

  private async getTotalRegistrations(organizerId: string): Promise<number> {
    const result = await this.registrationRepository
      .createQueryBuilder('registration')
      .innerJoin('registration.event', 'event')
      .select('COUNT(registration.id)', 'total')
      .where('event.organizerId = :organizerId', { organizerId })
      .getRawOne();

    return parseInt(result.total) || 0;
  }

  private async getRecentEvents(
    organizerId: string,
    limit: number,
  ): Promise<Event[]> {
    return this.eventRepository.find({
      where: { organizerId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['registrations'],
    });
  }
}
