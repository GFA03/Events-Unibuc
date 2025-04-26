import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Registration } from './entities/registration.entity';

@ApiTags('Registrations')
@ApiBearerAuth()
@Controller('registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Return 201 on successful creation
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Validate request body
  @ApiOperation({ summary: 'Register current user for an event time slot' })
  @ApiResponse({
    status: 201,
    description: 'Registration created successfully.',
    type: Registration,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error, event in past)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (JWT token required)',
  })
  @ApiResponse({ status: 404, description: 'Event time slot not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (User already registered for this slot)',
  })
  create(
    @Req() req,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<Registration | null> {
    return this.registrationsService.create(createRegistrationDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'List registrations (Admin/Organizer view, filtered)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of registrations.',
    type: [Registration],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (if access denied by service logic)',
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )
  findAll() {
    return this.registrationsService.findAll();
  }

  @Get('my')
  @ApiOperation({
    summary: 'List all registrations for the currently logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of registrations.',
    type: [Registration],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )
  async findMyRegistrations(@Req() req) {
    return this.registrationsService.findMyRegistrations(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific registration by its ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the registration record',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Registration details.',
    type: Registration,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (if user cannot access this registration)',
  })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful deletion
  @ApiOperation({
    summary: 'Cancel (delete) a registration (Owner, Admin, or Organizer)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the registration to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Registration successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user cannot delete this registration)',
  })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.registrationsService.remove(id);
  }
}
