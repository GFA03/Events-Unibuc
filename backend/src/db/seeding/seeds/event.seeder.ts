import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Event } from '../../../events/entities/event.entity';

export default class EventSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Event seeder');

    const eventFactory = factoryManager.get(Event);

    const organizerId = '22222222-2222-2222-2222-222222222222'; // Organizer from UserSeeder

    // Create 10 events and override organizerId manually
    await eventFactory.saveMany(10, { organizerId: organizerId });

    console.log('Event seeder END');
  }
}
