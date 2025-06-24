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
import { comparePassword, hashPassword } from '../utils/helpers';
import { UserResponseDto } from './dto/user-response.dto';
import { OrganizerResponseDto } from './dto/organizer-response.dto';
import { Role } from './entities/role.enum';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';

interface FindAllOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

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
   * @param emailVerificationToken
   * @param emailVerificationTokenExpires
   */
  async create(
    createUserDto: CreateUserDto,
    emailVerificationToken: string,
    emailVerificationTokenExpires: Date,
  ): Promise<User> {
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
      emailVerificationToken,
      emailVerificationTokenExpires,
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
  async findAll(
    options?: FindAllOptions,
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    this.logger.debug('Fetching all users');
    const { limit = 10, offset = 0, search } = options || {};

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.email) LIKE :search OR LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    queryBuilder.skip(offset).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users: users.map((user) => UserResponseDto.fromEntity(user)),
      total,
    };
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
   * Finds user by password reset token.
   */
  async findOneByPasswordResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { passwordResetToken: token },
    });
  }

  async findOrganizer(id: string): Promise<OrganizerResponseDto | null> {
    this.logger.debug(`Fetching organizer with ID: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['organizedEvents', 'organizedEvents.organizer'],
    });

    if (!user) {
      this.logger.warn(`Organizer not found with ID: ${id}`);
      return null;
    }

    if (user.role !== Role.ORGANIZER && user.role !== Role.ADMIN) {
      this.logger.warn(`User with ID: ${id} is not an organizer`);
      return null;
    }

    return OrganizerResponseDto.from(user);
  }

  /**
   * Find user by EMAIL
   * Returns UserResponseDto or null in case user not found
   * @param email
   */
  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Fetching user with email: ${email}`);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      return null;
    }

    return user;
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
  async findByPayload({
    email,
  }: {
    email: string;
  }): Promise<UserResponseDto | null> {
    this.logger.debug(`Finding user by payload with email: ${email}`);
    return this.findOneByEmail(email);
  }

  /**
   * Find user by email validation token
   * Return User or null if not found
   * @param token
   */
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      emailVerificationToken: token,
    });
  }

  /**
   * Mark email as verified
   * @param userId
   */
  async markEmailAsVerified(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    });
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

    // Don't let user update admin role
    if (
      updateData.role &&
      updateData.role === Role.ADMIN &&
      user.role !== Role.ADMIN
    ) {
      this.logger.warn(`Update failed - user cannot be set as admin: ${id}`);
      throw new ConflictException('Cannot set user as admin');
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
   * Change user password
   * @param id
   * @param currentPassword
   * @param newPassword
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    this.logger.log(`Changing password for user with ID: ${id}`);
    const user = await this.findOne(id);

    if (!user) {
      this.logger.warn(`Change password failed - user not found: ${id}`);
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      this.logger.warn(
        `Change password failed - invalid current password for user: ${id}`,
      );
      throw new ConflictException('Invalid current password');
    }

    // Update with new hashed password
    const hashedNewPassword = await hashPassword(newPassword);
    await this.updatePassword(id, hashedNewPassword);
    this.logger.log(`Successfully changed password for user: ${id}`);
  }

  async changePersonalInfo(
    id: string,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Changing personal info for user with ID: ${id}`);
    const user = await this.findOne(id);

    if (!user) {
      this.logger.warn(`Change personal info failed - user not found: ${id}`);
      throw new NotFoundException('User not found');
    }

    // Update only allowed fields
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updatePersonalInfoDto,
    });

    this.logger.log(`Successfully changed personal info for user: ${id}`);
    return UserResponseDto.fromEntity(updatedUser);
  }

  /**
   * Update email verification token, after it expired
   * @param userId
   * @param token
   * @param expires
   */
  async updateVerificationToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expires,
    });
  }

  /**
   * Updates user's password reset token and expiration.
   */
  async updatePasswordResetToken(
    userId: string,
    resetToken: string,
    tokenExpires: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: resetToken,
      passwordResetTokenExpires: tokenExpires,
    });
  }

  /**
   * Updates user's password.
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
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

  /**
   * Clears password reset token and expiration.
   */
  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });
  }
}
