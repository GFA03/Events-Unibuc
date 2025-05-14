import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { EventDateTime } from '../events/entities/event-date-time.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import UserSeeder from './seeding/seeds/user.seeder';
import EventSeeder from './seeding/seeds/event.seeder';
import EventDateTimeSeeder from './seeding/seeds/event-date-time.seeder';
import RegistrationSeeder from './seeding/seeds/registration.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Event, EventDateTime, Registration],
  seeds: [UserSeeder, EventSeeder, EventDateTimeSeeder, RegistrationSeeder],
  factories: ['src/db/seeding/factories/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);

if (process.argv[2] === 'seed') {
  dataSource
    .initialize()
    .then(() => runSeeders(dataSource))
    .then(() => {
      console.log('✅ Database seeded successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error while seeding:', err);
      process.exit(1);
    });
}

if (process.argv[2] === 'reset') {
  dataSource
    .initialize()
    .then(async () => {
      await dataSource.dropDatabase();
      await dataSource.synchronize();
      console.log('🧹 Database reset complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error while resetting DB:', err);
      process.exit(1);
    });
}
