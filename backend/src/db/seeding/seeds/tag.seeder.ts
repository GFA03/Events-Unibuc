import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class TagSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Tag seeder');

    const tagRepository = dataSource.getRepository('Tag');

    if ((await tagRepository.count()) > 0) {
      console.log('Tags already exist, skipping seeding.');
      return;
    }

    const tags = [
      { name: 'technology' },
      { name: 'health' },
      { name: 'education' },
      { name: 'finance' },
      { name: 'entertainment' },
      { name: 'sports' },
      { name: 'travel' },
      { name: 'food' },
      { name: 'lifestyle' },
      { name: 'art' },
      { name: 'boardgames' },
    ];

    try {
      await tagRepository.save(tags);
    } catch (error) {
      console.error('Error seeding tags:', error);
    }

    console.log('Tag seeder END');
  }
}
