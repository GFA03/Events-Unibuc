import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Registration } from '../../../registrations/entities/registration.entity';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../users/entities/role.enum';
import { Event } from '../../../events/entities/event.entity';

export default class RegistrationSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Registration seeder');
    const registrationsFactory = factoryManager.get(Registration);
    const userRepo = dataSource.getRepository(User);
    const eventRepo = dataSource.getRepository(Event);

    const users = await userRepo.find();
    const events = await eventRepo.find();

    for (const user of users) {
      if (user.role === Role.ORGANIZER || user.role === Role.ADMIN) {
        continue;
      }
      for (const event of events) {
        // 30% chance of registration
        if (Math.random() > 0.3) {
          continue;
        }
        await registrationsFactory.save({
          userId: user.id,
          eventId: event.id,
        });
      }
    }

    console.log('Registration seeder END');
  }
}
