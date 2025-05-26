import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizedUser } from '../auth/types/AuthorizedUser';
import { EventDateTime } from '../events/entities/event-date-time.entity';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(EventDateTime)
    private readonly eventDateTimeRepository: Repository<EventDateTime>,
  ) {}

  async create(
    createRegistrationDto: CreateRegistrationDto,
    currentUser: AuthorizedUser,
  ): Promise<Registration | null> {
    this.logger.log(
      `Creating registration for user ${currentUser.userId} for event time slot ${createRegistrationDto.eventDateTimeId}`,
    );
    const { eventDateTimeId } = createRegistrationDto;
    const userId = currentUser.userId;

    // 1. Validate that the EventDateTime slot exists and is in the future
    const eventDateTime = await this.eventDateTimeRepository.findOne({
      where: { id: eventDateTimeId },
    });

    if (!eventDateTime) {
      this.logger.warn(`Event time slot not found: ${eventDateTimeId}`);
      throw new NotFoundException(
        `The specified event time slot was not found.`,
      );
    }

    if (new Date(eventDateTime.startDateTime) <= new Date()) {
      this.logger.warn(
        `Attempted registration for past event slot: ${eventDateTimeId}`,
      );
      throw new BadRequestException(
        'Cannot register for an event slot that has already started or passed.',
      );
    }

    // 2. Check for existing registration
    const existingCount = await this.registrationRepository.count({
      where: { userId, eventDateTimeId },
    });
    if (existingCount > 0) {
      this.logger.warn(
        `Duplicate registration attempt by user ${userId} for slot ${eventDateTimeId}`,
      );
      throw new ConflictException(
        'You are already registered for this event time slot.',
      );
    }

    const newRegistration = this.registrationRepository.create({
      eventDateTimeId,
      userId,
    });

    try {
      const saved = await this.registrationRepository.save(newRegistration);
      this.logger.log(
        `Successfully created registration ${saved.id} for user ${userId}`,
      );
      return this.findOne(saved.id);
    } catch (error) {
      this.logger.error(
        `Failed to create registration: ${error.message}`,
        error.stack,
      );
      if (error.code === '23505' || error.message?.includes('UNIQUE')) {
        throw new ConflictException(
          'You are already registered for this event time slot.',
        );
      }
      throw new InternalServerErrorException(
        'Could not complete registration due to a server error.',
      );
    }
  }

  findAll(): Promise<Registration[]> {
    this.logger.debug('Fetching all registrations');
    return this.registrationRepository.find();
  }

  async findOne(id: string): Promise<Registration | null> {
    this.logger.debug(`Fetching registration with ID: ${id}`);
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: [
        'user',
        'eventDateTime',
        'eventDateTime.event',
        'eventDateTime.event.organizer',
      ],
    });
    if (!registration) {
      this.logger.warn(`Registration not found: ${id}`);
      return null;
    }
    return registration;
  }

  async findMyRegistrations(userId: string): Promise<Registration[]> {
    this.logger.debug(`Fetching registrations for user: ${userId}`);
    return this.registrationRepository.find({
      where: { userId },
      relations: [
        'user',
        'eventDateTime',
        'eventDateTime.event',
        'eventDateTime.event.organizer',
      ],
    });
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to remove registration: ${id}`);
    const result = await this.registrationRepository.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Failed to delete registration: ${id}`);
      throw new NotFoundException('Registration not found');
    }
    this.logger.log(`Successfully removed registration: ${id}`);
  }
}
