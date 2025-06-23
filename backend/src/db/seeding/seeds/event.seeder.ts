import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Event } from '../../../events/entities/event.entity';
import { faker } from '@faker-js/faker';
import { Tag } from '../../../tags/entities/tag.entity';

export default class EventSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Event seeder');

    const eventFactory = factoryManager.get(Event);

    const tagRepository = dataSource.getRepository(Tag);

    const tags = await tagRepository.find();

    const organizers = [
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333',
      '44444444-4444-4444-4444-444444444444',
    ];

    for (let i = 0; i < 20; i++) {
      await eventFactory.save({
        organizerId: faker.helpers.arrayElement(organizers),
        tags: faker.helpers.arrayElements(tags, {
          min: 1,
          max: 3, // Each event can have 1 to 3 tags
        }),
      });
    }

    console.log('Event seeder END');
  }
}
