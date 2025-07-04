import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { Event } from './entities/event.entity';
import { RequestWithUser } from '../auth/types/RequestWithUser';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
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
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event> {
    return await this.eventsService.create(createEventDto, req.user, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active events' })
  @ApiResponse({
    status: 200,
    description: 'List of all events.',
    type: [Event],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of events to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of events to skip',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in event name and description',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by event type',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    description: 'Filter by location',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter by start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter by end date (ISO string)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['date', 'name', 'participants'],
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('location') location?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tags') tags?: string,
    @Query('sortBy') sortBy?: 'date' | 'name' | 'participants',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.eventsService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      search,
      type,
      location,
      startDate,
      endDate,
      tags,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || 'asc',
    });
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  @ApiOperation({ summary: 'Get events created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of events created by the user.',
    type: [Event],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMyEvents(@Req() req: RequestWithUser): Promise<Event[]> {
    return this.eventsService.findMyEvents(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiResponse({ status: 200, description: 'The event details.', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update an event (Admin/Organizer only)' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto & { removeImage?: boolean },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER) // Add role protection if needed
  @ApiOperation({ summary: 'Delete an event (Admin/Organizer only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id, req.user);
  }
}
