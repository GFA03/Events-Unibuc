import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { EventDateTime } from './entities/event-date-time.entity';
import { AuthorizedUser } from '../auth/types/AuthorizedUser';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    organizer: AuthorizedUser,
  ): Promise<Event> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newEvent = this.eventRepository.create({
        ...createEventDto, // Spread DTO properties
        organizerId: organizer.userId, // Assign organizer
        // TypeORM handles creating nested DateTimes if cascade is true
        dateTimes: createEventDto.dateTimes.map((dateTime) => ({
          ...dateTime,
        })), // Ensure new objects are created
      });
      const savedEvent = await queryRunner.manager.save(Event, newEvent);
      await queryRunner.commitTransaction();
      return this.findOne(savedEvent.id);
    } catch (err) {
      console.log(err.message);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to create event. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'dateTimes'], // Eager load necessary relations
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    let updatedDateTimes: EventDateTime[] | undefined = undefined;
    if (updateEventDto.dateTimes) {
      // Basic validation within service as well (though DTO handles format)
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
      // Map DTOs to entities (without IDs as they might be new)
      updatedDateTimes = updateEventDto.dateTimes.map(
        (dtDto) => ({ ...dtDto, eventId: id }) as EventDateTime,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { dateTimes, ...baseUpdateData } = updateEventDto; // Exclude DateTimes from direct update
      await queryRunner.manager.update(Event, id, baseUpdateData);

      if (updatedDateTimes) {
        // 1. Delete existing DateTimes for this event
        await queryRunner.manager.delete(EventDateTime, { eventId: id });

        // 2. Insert the new ones
        await queryRunner.manager.save(EventDateTime, updatedDateTimes);
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to update event. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    const result = await this.eventRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Event not found');
    }
  }
}
