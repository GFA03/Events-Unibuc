import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../users/entities/role.enum';
import { hashPassword } from '../../../utils/helpers';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
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
        email: 'organizer@example.com',
        password: await hashPassword('organizerpass'),
        firstName: 'Organizer',
        lastName: 'User',
        phoneNumber: '0700000002',
        role: Role.ORGANIZER,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'user1@example.com',
        password: await hashPassword('user1pass'),
        firstName: 'User',
        lastName: 'One',
        phoneNumber: '0700000003',
        role: Role.USER,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'user2@example.com',
        password: await hashPassword('user2pass'),
        firstName: 'User',
        lastName: 'Two',
        phoneNumber: '0700000004',
        role: Role.USER,
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'user3@example.com',
        password: await hashPassword('user3pass'),
        firstName: 'User',
        lastName: 'Three',
        phoneNumber: '0700000005',
        role: Role.USER,
      },
    ];

    console.log('User seeder END');

    await repo.insert(users); // Use insert() to preserve IDs
  }
}
