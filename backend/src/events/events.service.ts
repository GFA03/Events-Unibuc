import {
  BadRequestException,
  ConflictException,
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
import { AuthorizedUser } from '../auth/types/AuthorizedUser';
import { TagsService } from '../tags/tags.service';
import { EventResponseDto } from './dto/event-response.dto';

interface FindAllOptions {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  tags?: string; // Filtering by tag ids
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly tagsService: TagsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    organizer: AuthorizedUser,
  ): Promise<Event> {
    this.logger.log(`Creating new event by organizer ${organizer.userId}`);

    const { tagIds, ...eventData } = createEventDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = this.eventRepository.create({
        ...eventData,
        organizerId: organizer.userId,
      });

      if (tagIds && tagIds.length > 0) {
        event.tags = await this.tagsService.findByIds(tagIds);
      }

      const savedEvent = await queryRunner.manager.save(Event, event);
      await queryRunner.commitTransaction();
      this.logger.log(`Successfully created event with ID: ${savedEvent.id}`);
      return this.findOne(savedEvent.id);
    } catch (err) {
      if (err instanceof BadRequestException) {
        this.logger.error(`Failed to create event: ${err.message}`, err.stack);
      } else if (err instanceof NotFoundException) {
        this.logger.warn(`Event not found during creation: ${err.message}`);
      } else if (err instanceof ConflictException) {
        this.logger.warn(`Conflict during event creation: ${err.message}`);
      }

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
  ): Promise<{ data: EventResponseDto[]; total: number }> {
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
      tags,
      sortBy = 'date',
      sortOrder = 'asc',
    } = options || {};

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.tags', 'tags');

    queryBuilder.andWhere('event.endDateTime >= :currentDate', {
      currentDate: new Date(),
    });

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

    if (startDate) {
      queryBuilder.andWhere('event.startDateTime >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('event.startDateTime <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (tags !== undefined) {
      const tagIds = tags.split(',').filter(Boolean);
      if (tagIds.length > 0) {
        queryBuilder.andWhere('tags.id IN (:...tagIds)', { tagIds });
      }
    }

    switch (sortBy) {
      case 'name':
        queryBuilder.orderBy(
          'event.name',
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
        break;
      case 'date':
      default:
        queryBuilder.orderBy(
          'event.startDateTime',
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
        break;
    }

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    this.logger.debug(`Found ${total} events`);
    return { data: data.map((event) => new EventResponseDto(event)), total };
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

    const event = await this.findOne(id);

    const { tagIds } = updateEventDto;

    this.logger.debug(`Validating date times for event: ${id}`);

    // Validating date times
    if (updateEventDto.startDateTime) {
      if (new Date(updateEventDto.startDateTime) <= new Date()) {
        throw new BadRequestException(`Start date must be in the future.`);
      }
      if (updateEventDto.endDateTime) {
        if (
          new Date(updateEventDto.endDateTime) <=
          new Date(updateEventDto.startDateTime)
        ) {
          throw new BadRequestException(`End date must be after start date.`);
        }
      } else {
        if (
          new Date(event.endDateTime) <= new Date(updateEventDto.startDateTime)
        ) {
          throw new BadRequestException(
            `End date must be after start date for all slots.`,
          );
        }
      }
    }

    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        event.tags = await this.tagsService.findByIds(tagIds);
      } else {
        event.tags = [];
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Event, id, updateEventDto);
      await queryRunner.commitTransaction();
      this.logger.log(`Successfully updated event: ${id}`);
      return this.findOne(id);
    } catch (err) {
      if (err instanceof BadRequestException) {
        this.logger.error(`Failed to update event: ${err.message}`, err.stack);
      } else if (err instanceof NotFoundException) {
        this.logger.warn(`Event not found during update: ${err.message}`);
      } else if (err instanceof ConflictException) {
        this.logger.warn(`Conflict during event update: ${err.message}`);
      }
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
