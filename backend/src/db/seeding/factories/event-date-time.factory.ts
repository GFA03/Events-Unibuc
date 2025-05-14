import { setSeederFactory } from 'typeorm-extension';
import { EventDateTime } from '../../../events/entities/event-date-time.entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory(EventDateTime, () => {
  const dt = new EventDateTime();
  dt.startDateTime = faker.date.future();
  dt.endDateTime = faker.date.future({ refDate: dt.startDateTime });
  return dt;
});
