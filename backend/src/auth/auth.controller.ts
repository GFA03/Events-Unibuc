import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AccessToken } from './types/AccessToken';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthorizedUser } from './types/AuthorizedUser';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
    @Request() req, // req.user is set by the LocalAuthGuard
    @Body() loginUserDto: LoginUserDto, // DTO is used to validate the request body and Swagger definition
  ): Promise<AccessToken> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto | null> {
    const newUser = await this.authService.signup(createUserDto);
    return UserResponseDto.fromEntity(newUser);
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
  async getProfile(@Request() req): Promise<AuthorizedUser> {
    // req.user is populated by JwtAuthGuard -> JwtStrategy.validate
    // It contains the payload defined in JwtStrategy (userId, email, role)
    const userPayload = req.user as AuthorizedUser;

    // Return the payload directly as it contains the necessary info
    // If more data is needed, fetch from UsersService using userPayload.userId
    return userPayload;
  }
}
