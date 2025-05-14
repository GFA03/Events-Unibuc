import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Event } from '../../../events/entities/event.entity';
import { EventType } from '../../../events/entities/event-type.enum';

export default class EventSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Event seeder');

    const repo = dataSource.getRepository(Event);

    const events = Array.from({ length: 9 }, (_, i) => ({
      id: `e${i + 1}`.padEnd(36, '0'), // e1...e10 padded to UUID format
      name: `Sample Event ${i + 1}`,
      description: `This is a description for event ${i + 1}.`,
      location: `Location ${i + 1}`,
      type: i % 2 === 0 ? EventType.EVENT : EventType.WORKSHOP,
      organizerId: '22222222-2222-2222-2222-222222222222', // organizer user from previous seeder
    }));

    console.log('Event seeder END');
    await repo.insert(events);
  }
}
