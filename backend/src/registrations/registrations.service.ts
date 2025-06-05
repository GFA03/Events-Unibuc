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
import { Event } from '../events/entities/event.entity';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(
    createRegistrationDto: CreateRegistrationDto,
    currentUser: AuthorizedUser,
  ): Promise<Registration | null> {
    this.logger.log(
      `Creating registration for user ${currentUser.id} for event time slot ${createRegistrationDto.eventId}`,
    );
    const { eventId } = createRegistrationDto;
    const userId = currentUser.id;

    // 1. Validate that the event exists and is in the future
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      this.logger.warn(`Event time slot not found: ${eventId}`);
      throw new NotFoundException(
        `The specified event time slot was not found.`,
      );
    }

    if (new Date(event.endDateTime) <= new Date()) {
      this.logger.warn(
        `Attempted registration for past event slot: ${eventId}`,
      );
      throw new BadRequestException(
        'Cannot register for an event that has passed.',
      );
    }

    // 2. Check for existing registration
    const existingCount = await this.registrationRepository.count({
      where: { userId, eventId },
    });
    if (existingCount > 0) {
      this.logger.warn(
        `Duplicate registration attempt by user ${userId} for slot ${eventId}`,
      );
      throw new ConflictException(
        'You are already registered for this event time slot.',
      );
    }

    const newRegistration = this.registrationRepository.create({
      eventId,
      userId,
    });

    try {
      const saved = await this.registrationRepository.save(newRegistration);
      this.logger.log(
        `Successfully created registration ${saved.id} for user ${userId}`,
      );
      return this.findOne(eventId, userId);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException ||
        error instanceof Error
      ) {
        this.logger.error(
          `Error during registration creation: ${error.message}`,
          error.stack,
        );
      }
      if (error instanceof ConflictException) {
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

  async findOne(eventId: string, userId: string): Promise<Registration | null> {
    this.logger.debug(
      `Fetching registration with eventId: ${eventId} and userId: ${userId}`,
    );
    const registration = await this.registrationRepository.findOne({
      where: { eventId: eventId, userId: userId },
      relations: ['event', 'event.organizer'],
    });
    if (!registration) {
      this.logger.warn(`Registration not found: ${eventId}, ${userId}`);
      return null;
    }
    return registration;
  }

  async findMyRegistrations(userId: string): Promise<Registration[]> {
    this.logger.debug(`Fetching registrations for user: ${userId}`);
    return this.registrationRepository.find({
      where: { userId },
      relations: ['event', 'event.organizer'],
      order: { event: { startDateTime: 'DESC' } },
    });
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to remove registration: ${id}`);
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!registration) {
      this.logger.warn(`Registration not found: ${id}`);
      throw new NotFoundException('Registration not found');
    }

    if (new Date(registration.event.endDateTime) <= new Date()) {
      this.logger.warn(
        `Attempted unregistering for past event slot: ${registration.eventId}`,
      );
      throw new BadRequestException(
        'Cannot unregister from an event slot that has already started or passed.',
      );
    }

    const result = await this.registrationRepository.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Failed to delete registration: ${id}`);
      throw new NotFoundException('Registration not found');
    }
    this.logger.log(`Successfully removed registration: ${id}`);
  }
}
