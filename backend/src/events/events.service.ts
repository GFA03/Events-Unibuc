import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { EventDateTime } from './entities/event-date-time.entity';
import { AuthorizedUser } from '../auth/types/AuthorizedUser';

interface FindAllOptions {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    organizer: AuthorizedUser,
  ): Promise<Event> {
    this.logger.log(`Creating new event by organizer ${organizer.userId}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newEvent = this.eventRepository.create({
        ...createEventDto,
        organizerId: organizer.userId,
        dateTimes: createEventDto.dateTimes.map((dateTime) => ({
          ...dateTime,
        })),
      });
      const savedEvent = await queryRunner.manager.save(Event, newEvent);
      await queryRunner.commitTransaction();
      this.logger.log(`Successfully created event with ID: ${savedEvent.id}`);
      return this.findOne(savedEvent.id);
    } catch (err) {
      this.logger.error(`Failed to create event: ${err.message}`, err.stack);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to create event. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    options?: FindAllOptions,
  ): Promise<{ data: Event[]; total: number }> {
    this.logger.debug(
      `Fetching events with options: ${JSON.stringify(options)}`,
    );
    const {
      limit = 10,
      offset = 0,
      search,
      type,
      location,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'asc',
    } = options || {};

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.dateTimes', 'dateTimes');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(event.name) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search)) OR LOWER(organizer.firstName) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('event.type = :type', { type });
    }

    if (location) {
      queryBuilder.andWhere('LOWER(event.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }
    //
    // if (startDate) {
    //   queryBuilder.andWhere('dateTimes.startDate >= :startDate', {
    //     startDate: new Date(startDate),
    //   });
    // }
    //
    // if (endDate) {
    //   queryBuilder.andWhere('dateTimes.endDate <= :endDate', {
    //     endDate: new Date(endDate),
    //   });
    // }

    switch (sortBy) {
      case 'name':
        queryBuilder.orderBy(
          'event.name',
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
        break;
      default:
        queryBuilder.orderBy(
          'event.name',
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
        break;
    }

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    this.logger.debug(`Found ${total} events`);
    return { data, total };
  }

  async findOne(id: string): Promise<Event> {
    this.logger.debug(`Fetching event with ID: ${id}`);
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });
    if (!event) {
      this.logger.warn(`Event not found with ID: ${id}`);
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  findMyEvents(userId: string): Promise<Event[]> {
    this.logger.debug(`Fetching events for user: ${userId}`);
    return this.eventRepository.find({
      where: { organizerId: userId },
      relations: ['organizer'],
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    this.logger.log(`Updating event with ID: ${id}`);
    await this.findOne(id);

    let updatedDateTimes: EventDateTime[] | undefined = undefined;
    if (updateEventDto.dateTimes) {
      this.logger.debug(`Validating date times for event: ${id}`);
      updateEventDto.dateTimes.forEach((dt) => {
        if (new Date(dt.endDateTime) <= new Date(dt.startDateTime)) {
          throw new BadRequestException(
            `End date must be after start date for all slots.`,
          );
        }
        if (new Date(dt.startDateTime) <= new Date()) {
          throw new BadRequestException(
            `Start date must be in the future for all slots.`,
          );
        }
      });
      updatedDateTimes = updateEventDto.dateTimes.map(
        (dtDto) => ({ ...dtDto, eventId: id }) as EventDateTime,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { dateTimes, ...baseUpdateData } = updateEventDto;
      await queryRunner.manager.update(Event, id, baseUpdateData);

      if (updatedDateTimes) {
        this.logger.debug(`Updating date times for event: ${id}`);
        await queryRunner.manager.delete(EventDateTime, { eventId: id });
        await queryRunner.manager.save(EventDateTime, updatedDateTimes);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Successfully updated event: ${id}`);
      return this.findOne(id);
    } catch (err) {
      this.logger.error(
        `Failed to update event ${id}: ${err.message}`,
        err.stack,
      );
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to update event. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    this.logger.log(`Attempting to remove event: ${id}`);

    // check if event exists
    await this.findOne(id);

    const result = await this.eventRepository.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Failed to delete event: ${id}`);
      throw new NotFoundException('Event not found');
    }
    this.logger.log(`Successfully removed event: ${id}`);
  }
}
