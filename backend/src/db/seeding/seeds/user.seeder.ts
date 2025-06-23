import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../users/entities/role.enum';
import { hashPassword } from '../../../utils/helpers';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repo = dataSource.getRepository(User);

    console.log('User seeder');

    const users = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@example.com',
        password: await hashPassword('adminpass'),
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '0700000001',
        role: Role.ADMIN,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'organizer1@example.com',
        password: await hashPassword('organizerpass1'),
        firstName: 'ASMI',
        lastName: 'UB',
        phoneNumber: '0700000002',
        role: Role.ORGANIZER,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'organizer2@example.com',
        password: await hashPassword('organizerpass2'),
        firstName: 'ASLS',
        lastName: 'UB',
        phoneNumber: '0700000003',
        role: Role.ORGANIZER,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'organizer3@example.com',
        password: await hashPassword('organizerpass3'),
        firstName: 'ASAA',
        lastName: 'UB',
        phoneNumber: '0700000004',
        role: Role.ORGANIZER,
      },
    ];

    await repo.insert(users); // Use insert() to preserve IDs

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(100);

    console.log('User seeder END');
  }
}
