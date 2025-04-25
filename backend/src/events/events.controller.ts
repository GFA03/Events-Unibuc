import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { Event } from './entities/event.entity';
import { RequestWithUser } from '../auth/types/RequestWithUser';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Apply auth checks globally for this controller
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ORGANIZER)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @ApiOperation({ summary: 'Create a new event (Admin/Organizer only)' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully.',
    type: Event,
  })
  @ApiResponse({ status: 400, description: 'Validation Error.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Req() req: RequestWithUser,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    return await this.eventsService.create(createEventDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'List of all events.',
    type: [Event],
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiResponse({ status: 200, description: 'The event details.', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('uuid') uuid: string) {
    return this.eventsService.findOne(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN, Role.ORGANIZER) // Add role protection if needed
  @ApiOperation({ summary: 'Update an event (Admin/Organizer only)' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('uuid') uuid: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(uuid, updateEventDto);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN, Role.ORGANIZER) // Add role protection if needed
  @ApiOperation({ summary: 'Delete an event (Admin/Organizer only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('uuid') uuid: string) {
    return this.eventsService.remove(uuid);
  }
}
