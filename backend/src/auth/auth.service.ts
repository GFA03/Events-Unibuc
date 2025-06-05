import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './types/AccessToken';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { comparePassword } from '../utils/helpers';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'node:crypto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Validates user credentials against stored hash.
   * Called by LocalStrategy.
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
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
    return UserResponseDto.fromEntity(user);
  }

  /**
   * Handles user registration.
   * Called by AuthController signup endpoint.
   */
  async signup(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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
      const verificationToken = randomBytes(32).toString('hex');
      const tokenExpires = new Date();
      tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours

      const newUser = await this.usersService.create(
        createUserDto,
        verificationToken,
        tokenExpires,
      );

      // Send verification mail
      await this.emailService.sendEmailVerification(
        newUser.email,
        newUser.firstName,
        verificationToken,
      );

      this.logger.log(`Successfully created new user account: ${newUser.id}`);
      return UserResponseDto.fromEntity(newUser);
    } catch (error) {
      this.logger.error(
        `Failed to create user account: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Verifies user email with token.
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    this.logger.log(
      `Processing email verification for token: ${token.substring(0, 8)}...`,
    );

    const user = await this.usersService.findByEmailVerificationToken(token);

    if (!user) {
      this.logger.warn(`Email verification failed - invalid token`);
      throw new BadRequestException('Invalid verification token');
    }

    if (
      user.emailVerificationTokenExpires &&
      user.emailVerificationTokenExpires < new Date()
    ) {
      this.logger.warn(
        `Email verification failed - token expired for user: ${user.id}`,
      );
      throw new BadRequestException('Verification token has expired');
    }

    if (user.isEmailVerified) {
      this.logger.warn(
        `Email verification failed - already verified for user: ${user.id}`,
      );
      throw new BadRequestException('Email is already verified');
    }

    // Update user verification status
    await this.usersService.markEmailAsVerified(user.id);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.firstName);

    this.logger.log(`Successfully verified email for user: ${user.id}`);

    return {
      message: 'Email successfully verified! You can now log in.',
    };
  }

  /**
   * Resends verification email.
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    this.logger.log(`Resending verification email for: ${email}`);

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    await this.usersService.updateVerificationToken(
      user.id,
      verificationToken,
      tokenExpires,
    );

    // Send verification email
    await this.emailService.sendEmailVerification(
      user.email,
      user.firstName,
      verificationToken,
    );

    this.logger.log(`Resent verification email for user: ${user.id}`);

    return {
      message: 'Verification email sent! Please check your inbox.',
    };
  }

  /**
   * Generates a JWT for a successfully authenticated user.
   * Called by AuthController login endpoint.
   */
  async login(user: UserResponseDto): Promise<AccessToken> {
    this.logger.log(`Generating JWT for user: ${user.id}`);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Successfully generated JWT for user: ${user.id}`);
    return {
      access_token: token,
    };
  }
}
