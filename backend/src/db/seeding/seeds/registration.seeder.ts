import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Registration } from '../../../registrations/entities/registration.entity';
import { User } from '../../../users/entities/user.entity';
import { EventDateTime } from '../../../events/entities/event-date-time.entity';

export default class RegistrationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Registration seeder');
    const registrationRepo = dataSource.getRepository(Registration);
    const userRepo = dataSource.getRepository(User);
    const dtRepo = dataSource.getRepository(EventDateTime);

    const users = await userRepo.find();
    const dateTimes = await dtRepo.find({ relations: ['event'] });

    const registrations: Registration[] = [];
    let counter = 1;

    // Group dateTimes by eventId
    const eventGroups: Record<string, EventDateTime[]> = {};
    for (const dt of dateTimes) {
      if (!eventGroups[dt.eventId]) eventGroups[dt.eventId] = [];
      eventGroups[dt.eventId].push(dt);
    }

    for (const [eventId, slots] of Object.entries(eventGroups)) {
      const firstSlot = slots[0];
      const secondSlot = slots[1];

      if (!firstSlot || !secondSlot) continue; // Skip if fewer than 2 slots

      registrations.push(
        registrationRepo.create({
          id: `r${counter++}`.padEnd(counter <= 9 ? 36 : 35, '0'),
          userId: users[0].id,
          eventDateTimeId: firstSlot.id,
        }),
        registrationRepo.create({
          id: `r${counter++}`.padEnd(counter <= 9 ? 36 : 35, '0'),
          userId: users[1].id,
          eventDateTimeId: secondSlot.id,
        }),
      );
    }

    console.log('Registration seeder END');
    await registrationRepo.save(registrations);
  }
}
