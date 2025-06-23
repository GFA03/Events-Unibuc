import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AccessToken } from './types/AccessToken';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthorizedUser } from './types/AuthorizedUser';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RequestWithUser } from './types/RequestWithUser';
import { RequestWithUserResponse } from './types/RequestWithUserResponse';
import { ForgotPasswordDto } from './types/ForgotPasswordDto';
import { ResetPasswordDto } from './types/ResetPasswordDto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registration successful.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request (Validation failed).',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict (Email already exists).',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  login(
    @Request() req: RequestWithUserResponse, // req.user is set by the LocalStrategy
  ): Promise<AccessToken> {
    return this.authService.login(req.user);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (if account exists)',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) // Trigger JwtStrategy via Passport
  @ApiBearerAuth() // Swagger UI indication that Bearer token is needed
  @ApiOperation({ summary: 'Get profile of the currently authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile data.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized (Token missing, invalid, or expired).',
  })
  getProfile(@Request() req: RequestWithUser): AuthorizedUser {
    // req.user is populated by JwtAuthGuard -> JwtStrategy.validate
    // It contains the payload defined in JwtStrategy (id, email, role)
    // Return the payload directly as it contains the necessary info
    // If more data is needed, fetch from UsersService using userPayload.id
    return req.user;
  }
}
