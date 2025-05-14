import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Registration } from '../../../registrations/entities/registration.entity';
import { User } from '../../../users/entities/user.entity';
import { EventDateTime } from '../../../events/entities/event-date-time.entity';
import { Role } from '../../../users/entities/role.enum';

export default class RegistrationSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Registration seeder');
    const registrationsFactory = factoryManager.get(Registration);
    const userRepo = dataSource.getRepository(User);
    const dtRepo = dataSource.getRepository(EventDateTime);

    const users = await userRepo.find();
    const dateTimes = await dtRepo.find({ relations: ['event'] });

    for (const user of users) {
      if (user.role === Role.ORGANIZER || user.role === Role.ADMIN) {
        continue;
      }
      for (const dt of dateTimes) {
        await registrationsFactory.save({
          userId: user.id,
          eventDateTimeId: dt.id,
        });
      }
    }

    console.log('Registration seeder END');
  }
}
