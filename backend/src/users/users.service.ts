import {
  ConflictException,
  Injectable,
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
    const { email } = createUserDto;

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = {
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    };

    // Save the user in the database
    return this.userRepository.save(newUser);
  }

  /**
   * Returns list of all Users
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Find user by UUID
   * Returns found user or null in case user not found
   * @param id
   */
  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
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
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    return UserResponseDto.fromEntity(user);
  }

  /**
   * Find user by EMAIL
   * Return User or null
   * @param email
   * @param password
   */
  async findByLogin(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
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
    const updateData = { ...updateUserDto };
    const user = await this.userRepository.preload({
      id: id,
      ...updateData,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }

  /**
   * Remove user after id
   * Throws NotFoundException if user not found
   * @param id
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
