import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from '../utils/helpers';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates and returns the new user
   * Throws ConflictException if email already exists
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    const { email } = createUserDto;

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      this.logger.warn(
        `Attempted to create user with existing email: ${email}`,
      );
      throw new ConflictException('User already exists');
    }

    const newUser = {
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    };

    try {
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`Successfully created user with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Returns list of all Users
   */
  findAll(): Promise<User[]> {
    this.logger.debug('Fetching all users');
    return this.userRepository.find();
  }

  /**
   * Find user by UUID
   * Returns found user or null in case user not found
   * @param id
   */
  async findOne(id: string): Promise<User | null> {
    this.logger.debug(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      return null;
    }
    return user;
  }

  /**
   * Find user by EMAIL
   * Returns UserResponseDto or null in case user not found
   * @param email
   */
  async findOneByEmail(email: string): Promise<UserResponseDto | null> {
    this.logger.debug(`Fetching user with email: ${email}`);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      return null;
    }

    return UserResponseDto.fromEntity(user);
  }

  /**
   * Find user by EMAIL
   * Return User or null
   * @param email
   */
  async findByLogin(email: string): Promise<User | null> {
    this.logger.debug(`Attempting login for user with email: ${email}`);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(`Login attempt failed - user not found: ${email}`);
      return null;
    }

    return user;
  }

  /**
   * Find user by payload (after email)
   * Return UserResponseDto or null if not found
   * @param email
   */
  async findByPayload({ email }: any): Promise<UserResponseDto | null> {
    this.logger.debug(`Finding user by payload with email: ${email}`);
    return this.findOneByEmail(email);
  }

  /**
   * Update user with updateUserDto by searching after id
   * Returns User with updated data
   * Throws NotFoundException if user not found
   * @param id
   * @param updateUserDto
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with ID: ${id}`);
    const updateData = { ...updateUserDto };
    const user = await this.userRepository.preload({
      id: id,
      ...updateData,
    });

    if (!user) {
      this.logger.warn(`Update failed - user not found: ${id}`);
      throw new NotFoundException('User not found');
    }

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`Successfully updated user: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Failed to update user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Remove user after id
   * Throws NotFoundException if user not found
   * @param id
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to remove user: ${id}`);
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`Delete failed - user not found: ${id}`);
      throw new NotFoundException('User not found');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Delete failed - no rows affected for user: ${id}`);
      throw new NotFoundException('User not found');
    }
    this.logger.log(`Successfully removed user: ${id}`);
  }
}
