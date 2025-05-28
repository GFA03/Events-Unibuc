import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Request as ExpressRequest } from 'express';
import { Role } from '../users/entities/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EventType } from './entities/event-type.enum';
import { Event } from './entities/event.entity';
import { AuthorizedUser } from '../auth/types/AuthorizedUser';
import { CreateEventDto } from './dto/create-event.dto';

const mockEventsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockGuard = { canActivate: jest.fn(() => true) };

interface MockRequestWithUser extends ExpressRequest {
  user: AuthorizedUser;
}

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockUserId = 'mock-uuid-ctrl';
  const mockAuthorizedUser: AuthorizedUser = {
    userId: mockUserId,
    email: 'test.ctrl@example.com',
    role: Role.ORGANIZER, // Use a role allowed by @Roles
  };

  // Mock Request object containing the authorized user
  const mockRequest: MockRequestWithUser = {
    user: mockAuthorizedUser,
  } as MockRequestWithUser; // Cast to bypass other Request properties needed by TS

  const mockEventId = 'mock-uuid-event';

  const mockEvent: Event = {
    id: mockEventId,
    name: 'Name 1',
    type: EventType.WORKSHOP,
    description: 'This is a description!',
    location: 'Virtual',
    organizerId: mockUserId,
    startDateTime: new Date('2025-10-01T10:00:00Z'),
    endDateTime: new Date('2025-10-01T12:00:00Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Event;

  const mockCreateEventDto: CreateEventDto = {
    name: 'New Test Event',
    type: EventType.EVENT,
    description: 'Description for the new event.',
    location: 'Conference Room A',
    startDateTime: new Date('2025-11-01T09:00:00Z'),
    endDateTime: new Date('2025-11-01T17:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    // it('should return a created event', () => {});
    // it('should not return the password for the organizer', () => {});
    it('should call EventsService.create with correct parameters and return the created event', async () => {
      // Arrange: Configure the mock service create method
      const expectedEvent = {
        ...mockEvent,
        ...mockCreateEventDto,
        id: 'new-event-uuid',
      }; // Simulate returned event
      mockEventsService.create.mockResolvedValue(expectedEvent);

      // Act: Call the controller method
      const result = await controller.create(mockRequest, mockCreateEventDto);

      // Assert: Check if service method was called correctly
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        mockCreateEventDto,
        mockAuthorizedUser,
      );

      // Assert: Check if the result matches the expected output
      expect(result).toEqual(expectedEvent);
    });
  });
});
