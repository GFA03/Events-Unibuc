import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { comparePassword, hashPassword } from '../utils/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = {
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    };

    // Save the user in the database
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    const areEqual = await comparePassword(password, user.password);

    if (!areEqual) {
      return null;
    }

    return user;
  }

  async findByPayload({ email }: any): Promise<User> {
    return this.findOneByEmail(email);
  }

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
