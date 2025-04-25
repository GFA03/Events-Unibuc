import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  create(
    createRegistrationDto: CreateRegistrationDto,
    userId: string,
  ): Promise<Registration> {
    const newRegistration = this.registrationRepository.create({
      ...createRegistrationDto,
      userId,
    });
    return this.registrationRepository.save(newRegistration);
  }

  findAll(): Promise<Registration[]> {
    return this.registrationRepository.find();
  }

  async findOne(id: string): Promise<Registration | null> {
    const registration = await this.registrationRepository.findOneBy({
      id,
    });
    if (!registration) {
      return null;
    }
    return registration;
  }

  async remove(id: string): Promise<void> {
    const result = await this.registrationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Registration not found');
    }
  }
}
