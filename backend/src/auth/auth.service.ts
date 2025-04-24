import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
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
    const user = await this.usersService.findByLogin({ email, password: pass });
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user; // Exclude the password from the result
    return result;
  }

  /**
   * Handles user registration.
   * Called by AuthController signup endpoint.
   */
  async signup(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return await this.usersService.create(createUserDto);
  }

  /**
   * Generates a JWT for a successfully authenticated user.
   * Called by AuthController login endpoint.
   */
  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
