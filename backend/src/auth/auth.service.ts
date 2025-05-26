import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { comparePassword } from '../utils/helpers';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials against stored hash.
   * Called by LocalStrategy.
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    this.logger.debug(`Validating user credentials for email: ${email}`);
    const user = await this.usersService.findByLogin(email);
    if (!user) {
      this.logger.warn(`Validation failed - user not found: ${email}`);
      return null;
    }

    const areEqual = await comparePassword(pass, user.password);

    if (!areEqual) {
      this.logger.warn(
        `Validation failed - invalid password for user: ${email}`,
      );
      return null;
    }

    this.logger.debug(`Successfully validated user: ${email}`);
    const { password, ...result } = user;
    return result;
  }

  /**
   * Handles user registration.
   * Called by AuthController signup endpoint.
   */
  async signup(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(
      `Processing signup request for email: ${createUserDto.email}`,
    );
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      this.logger.warn(
        `Signup failed - user already exists: ${createUserDto.email}`,
      );
      throw new BadRequestException('User already exists');
    }

    try {
      const newUser = await this.usersService.create(createUserDto);
      this.logger.log(`Successfully created new user account: ${newUser.id}`);
      return newUser;
    } catch (error) {
      this.logger.error(
        `Failed to create user account: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generates a JWT for a successfully authenticated user.
   * Called by AuthController login endpoint.
   */
  async login(user: User): Promise<AccessToken> {
    this.logger.log(`Generating JWT for user: ${user.id}`);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Successfully generated JWT for user: ${user.id}`);
    return {
      access_token: token,
    };
  }
}
