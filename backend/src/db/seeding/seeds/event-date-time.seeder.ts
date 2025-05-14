import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { EventDateTime } from '../../../events/entities/event-date-time.entity';
import { Event } from '../../../events/entities/event.entity';

export default class EventDateTimeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Event Date Time seeder');

    const repo = dataSource.getRepository(EventDateTime);
    const eventRepo = dataSource.getRepository(Event);

    const events = await eventRepo.find();

    let counter = 1;
    const dateTimes: EventDateTime[] = [];

    for (const event of events) {
      const now = new Date();
      const dt1 = repo.create({
        id: `d${counter++}`.padEnd(counter <= 9 ? 36 : 35, '0'),
        event,
        startDateTime: new Date(now.getTime() + 3600_000 * counter),
        endDateTime: new Date(now.getTime() + 3600_000 * (counter + 1)),
      });

      const dt2 = repo.create({
        id: `d${counter++}`.padEnd(counter <= 9 ? 36 : 35, '0'),
        event,
        startDateTime: new Date(now.getTime() + 3600_000 * counter),
        endDateTime: new Date(now.getTime() + 3600_000 * (counter + 1)),
      });

      dateTimes.push(dt1, dt2);
    }

    console.log('Event Date Time seeder END');
    await repo.save(dateTimes);
  }
}
