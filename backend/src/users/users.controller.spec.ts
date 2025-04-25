import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Mock guards
import { RolesGuard } from '../auth/roles.guard';
import { UserResponseDto } from './dto/user-response.dto';

// Mock UsersService methods
const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock guard - allows all requests in unit tests
const mockGuard = { canActivate: jest.fn(() => true) };

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserId = 'mock-uuid-ctrl';
  const mockUser: User = {
    id: mockUserId,
    email: 'test.ctrl@example.com',
    password: 'hashed_password_ctrl',
    firstName: 'TestCtrl',
    lastName: 'UserCtrl',
    phoneNumber: '111222333',
    role: Role.USER,
    organizedEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, // Use the mock object
        },
      ],
    })
      // Override guards for unit testing controllers easily
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call usersService.findAll and return the result', async () => {
      const users = [mockUser, { ...mockUser, id: 'other-uuid' }];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with uuid and return the result', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUserId);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = { firstName: 'UpdatedCtrl' };

    it('should call usersService.update with uuid and dto, and return the result', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(mockUserId, updateUserDto);
      const userResponseDto = UserResponseDto.fromEntity(updatedUser);

      expect(service.update).toHaveBeenCalledWith(mockUserId, updateUserDto);
      expect(result).toEqual(userResponseDto);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with uuid', async () => {
      mockUsersService.remove.mockResolvedValue(undefined); // remove returns void

      await controller.remove(mockUserId);

      expect(service.remove).toHaveBeenCalledWith(mockUserId);
    });
  });
});
