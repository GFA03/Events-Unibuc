import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

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

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: MockRepository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: createMockRepository<Event>(),
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<MockRepository<Event>>(
      getRepositoryToken(Event),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
