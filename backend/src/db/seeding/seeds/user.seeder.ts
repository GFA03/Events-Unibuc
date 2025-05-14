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
        email: 'organizer@example.com',
        password: await hashPassword('organizerpass'),
        firstName: 'Organizer',
        lastName: 'User',
        phoneNumber: '0700000002',
        role: Role.ORGANIZER,
      },
    ];

    await repo.insert(users); // Use insert() to preserve IDs

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(5);

    console.log('User seeder END');
  }
}
