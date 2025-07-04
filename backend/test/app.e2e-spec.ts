import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ObjectLiteral, Repository } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/entities/role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { comparePassword } from '../src/utils/helpers';

jest.mock('../src/utils/helpers', () => ({
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
  findOneBy: jest.fn(),
});

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: MockRepository<User>;
  let authService: AuthService;
  let jwtToken: string; // Store JWT token for use in tests

  const mockUser: User = {
    id: 'e2e-user-id',
    email: 'e2e@example.com',
    password: 'hashed_e2e_password', // The service will hash the plain password input
    firstName: 'E2E',
    lastName: 'User',
    phoneNumber: '555666777',
    isEmailVerified: true,
    emailVerificationTokenExpires: null,
    emailVerificationToken: null,
    passwordResetTokenExpires: null,
    passwordResetToken: null,
    organizedEvents: [],
    registrations: [],
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // IMPORTANT: Override the real repository provider with our mock
      .overrideProvider(getRepositoryToken(User))
      .useValue(createMockRepository<User>())
      .compile();

    app = moduleFixture.createNestApplication();
    // Apply pipes globally like in main.ts
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Get instances for mocking and token generation
    userRepository = moduleFixture.get<MockRepository<User>>(
      getRepositoryToken(User),
    );
    authService = moduleFixture.get<AuthService>(AuthService); // Get auth service to generate a token

    // Generate a token for protected routes tests
    const tokenResult = await authService.login(mockUser); // Use the mock user
    jwtToken = tokenResult.access_token;
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks(); // Restore original implementations mocked with jest.mock
  });

  beforeEach(() => {
    // Reset mock calls before each test
    jest.clearAllMocks(); // Clears call counts etc.
    // Reset mock implementations if necessary (e.g., findOneBy)
    userRepository.findOneBy?.mockReset();
  });

  describe('/auth/login (POST)', () => {
    it('should return JWT token on valid credentials', async () => {
      // Mock UsersService.findByLogin behavior (which uses repository.findOneBy)
      userRepository.findOneBy?.mockResolvedValue(mockUser); // Simulate user found by email
      // comparePassword mock will handle the password check

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'e2e_password' }) // Use plain password
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'e2e@example.com',
      });
      // Check if comparePassword was called (implicitly via UsersService -> validateUser)
      expect(comparePassword).toHaveBeenCalledWith(
        'e2e_password',
        'hashed_e2e_password',
      );
    });

    it('should return 401 Unauthorized on invalid credentials (user not found)', async () => {
      userRepository.findOneBy?.mockResolvedValue(null); // Simulate user not found

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'e2e_password' })
        .expect(401); // LocalAuthGuard throws UnauthorizedException

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'wrong@example.com',
      });
    });

    it('should return 401 Unauthorized on invalid credentials (wrong password)', async () => {
      userRepository.findOneBy?.mockResolvedValue(mockUser); // Simulate user found
      // comparePassword mock will return false for 'wrong_password'

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'wrong_password' })
        .expect(401); // LocalAuthGuard throws UnauthorizedException

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'e2e@example.com',
      });
      expect(comparePassword).toHaveBeenCalledWith(
        'wrong_password',
        'hashed_e2e_password',
      );
    });
  });

  describe('/profile (GET)', () => {
    it('should return user profile data with valid JWT', async () => {
      // Mock the user lookup done by JwtStrategy.validate (which uses usersService.findByPayload -> findOneByEmail)
      userRepository.findOneBy?.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // JwtStrategy puts payload { email, id, role } into req.user by default
      // AppController returns req.user directly
      expect(response.body).toEqual({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
        // These come from the JWT payload generated by authService.login
      });
      // Verify that the JwtStrategy validation lookup happened
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should return 401 Unauthorized without JWT', async () => {
      await request(app.getHttpServer()).get('/profile').expect(401);
    });

    it('should return 401 Unauthorized with invalid/expired JWT', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
      // Note: No repository call should happen here as JWT verification fails first
      expect(userRepository.findOneBy).not.toHaveBeenCalled();
    });
  });
});
