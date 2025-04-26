import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
    const { eventDateTimeId } = createRegistrationDto;
    const userId = currentUser.userId;

    // 1. Validate that the EventDateTime slot exists and is in the future
    const eventDateTime = await this.eventDateTimeRepository.findOne({
      where: { id: eventDateTimeId },
    });

    if (!eventDateTime) {
      throw new NotFoundException(
        `The specified event time slot was not found.`,
      );
    }

    if (new Date(eventDateTime.startDateTime) <= new Date()) {
      throw new BadRequestException(
        'Cannot register for an event slot that has already started or passed.',
      );
    }

    // 2. Check for existing registration (handled by DB constraint, but check first for clarity)
    const existingCount = await this.registrationRepository.count({
      where: { userId, eventDateTimeId },
    });
    if (existingCount > 0) {
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
      return this.findOne(saved.id); // Pass flag to bypass permission check
    } catch (error) {
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
    return this.registrationRepository.find();
  }

  async findOne(id: string): Promise<Registration | null> {
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
      return null;
    }
    return registration;
  }

  async findMyRegistrations(userId: string): Promise<Registration[]> {
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
    const result = await this.registrationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Registration not found');
    }
  }
}
