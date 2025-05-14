import { setSeederFactory } from 'typeorm-extension';
import { Event } from '../../../events/entities/event.entity';
import { EventType } from '../../../events/entities/event-type.enum';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Event, () => {
  const event = new Event();
  event.name = faker.lorem.words(3);
  event.description = faker.lorem.paragraph();
  event.location = faker.location.streetAddress();
  event.type = faker.helpers.arrayElement(Object.values(EventType));
  return event;
});
