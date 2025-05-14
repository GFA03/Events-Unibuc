import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { EventDateTime } from '../../../events/entities/event-date-time.entity';
import { Event } from '../../../events/entities/event.entity';

export default class EventDateTimeSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Event Date Time seeder');

    const dtFactory = factoryManager.get(EventDateTime);
    const eventRepo = dataSource.getRepository(Event);

    const events = await eventRepo.find();

    for (const event of events) {
      await dtFactory.saveMany(2, { event });
    }

    console.log('Event Date Time seeder END');
  }
}
