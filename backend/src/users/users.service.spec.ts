import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './entities/role.enum';
import { NotFoundException } from '@nestjs/common';
import { comparePassword } from '../utils/helpers';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('../utils/helpers', () => ({
  hashPassword: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  comparePassword: jest.fn((plain, hashed) =>
    Promise.resolve(hashed === `hashed_${plain}`),
  ),
}));

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  preload: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  const mockUserId = 'mock-uuid-1';
  const mockUser: User = {
    id: mockUserId,
    email: 'test@example.com',
    password: 'hashed_password123',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '1234567890',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      password: 'password',
      firstName: 'New',
      lastName: 'User',
      phoneNumber: '333222111',
    };

    it('should create and return a user', async () => {
      userRepository.findOneBy?.mockResolvedValue(null); // No existing user
      userRepository.save?.mockImplementation(async (user: User) => ({
        ...user,
        id: 'new-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.create(createUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          password: 'hashed_password',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '333222111',
        }),
      );
      expect(result.password).not.toBe(createUserDto.password); // Password is hashed
      expect(result.id).toBeDefined();
    });

    it('should throw HttpException if user already exists', async () => {
      userRepository.findOneBy?.mockResolvedValue(mockUser); // User found
      await expect(service.create(createUserDto)).rejects.toThrowError(
        'User already exists',
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        mockUser,
        { ...mockUser, id: 'mock-uuid-2', email: 'test2@example.com' },
      ];
      userRepository.find?.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      userRepository.findOneBy?.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUserId);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockUserId });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockUserId });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found by email', async () => {
      userRepository.findOneBy?.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should throw NotFoundException if user not found by email', async () => {
      const nonExistentEmail = 'notfound@example.com';
      userRepository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOneByEmail(nonExistentEmail)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: nonExistentEmail,
      });
    });
  });

  describe('findByLogin', () => {
    beforeEach(() => {
      (comparePassword as jest.Mock).mockClear(); // Reset mock before each test
    });

    const loginDto = { email: mockUser.email, password: 'password123' };

    it('should return user on successful login', async () => {
      // Mock findOneBy to return the user with the hashed password
      userRepository.findOneBy?.mockResolvedValue({
        ...mockUser,
        password: 'hashed_password123',
      });
      // comparePassword mock is already set up to return true for this combination

      const result = await service.findByLogin(loginDto);

      expect(result).toEqual({ ...mockUser, password: 'hashed_password123' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_password123',
      );
    });

    it('should return null if user not found', async () => {
      userRepository.findOneBy?.mockResolvedValue(null);

      const result = await service.findByLogin(loginDto);

      expect(result).toBeNull();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('should return null if password does not match', async () => {
      userRepository.findOneBy?.mockResolvedValue({
        ...mockUser,
        password: 'hashed_wrongpassword',
      });
      // comparePassword mock will return false for 'password123' vs 'hashed_wrongpassword'

      const result = await service.findByLogin(loginDto);

      expect(result).toBeNull();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_wrongpassword',
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

    it('should update and return the user', async () => {
      const updatedUserData = {
        ...mockUser,
        ...updateUserDto,
        updatedAt: new Date(),
      };
      userRepository.preload?.mockResolvedValue(updatedUserData); // Simulate preload finding and merging
      userRepository.save?.mockResolvedValue(updatedUserData);

      const result = await service.update(mockUserId, updateUserDto);

      expect(userRepository.preload).toHaveBeenCalledWith({
        id: mockUserId,
        ...updateUserDto,
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUserData);
      expect(result).toEqual(updatedUserData);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      userRepository.preload?.mockResolvedValue(null); // Simulate preload not finding the user

      await expect(service.update(mockUserId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.preload).toHaveBeenCalledWith({
        id: mockUserId,
        ...updateUserDto,
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      // First, mock findOne to confirm the user exists before deletion
      userRepository.findOneBy?.mockResolvedValue(mockUser);
      // Mock delete to simulate successful deletion
      userRepository.delete?.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(mockUserId);

      // Check that findOne was called first (implicitly by service.findOne)
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockUserId });
      // Check that delete was called
      expect(userRepository.delete).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw NotFoundException if user to remove is not found (during findOne check)', async () => {
      userRepository.findOneBy?.mockResolvedValue(null); // Mock findOne failing

      await expect(service.remove(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockUserId });
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if delete operation affects 0 rows', async () => {
      // This scenario is less likely if findOne succeeds, but good practice to test
      userRepository.findOneBy?.mockResolvedValue(mockUser); // Mock findOne succeeding
      userRepository.delete?.mockResolvedValue({ affected: 0, raw: {} }); // Mock delete failing silently

      await expect(service.remove(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockUserId });
      expect(userRepository.delete).toHaveBeenCalledWith(mockUserId);
    });
  });
});
