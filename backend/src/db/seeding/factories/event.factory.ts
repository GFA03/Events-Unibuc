import { setSeederFactory } from 'typeorm-extension';
import { Event } from '../../../events/entities/event.entity';
import { EventType } from '../../../events/entities/event-type.enum';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Event, () => {
  const event = new Event();
  event.name = faker.commerce.productName();
  event.description = faker.lorem.paragraph();
  event.location = faker.location.streetAddress();
  event.noParticipants = faker.number.int({ min: 1, max: 1000 });
  event.type = faker.helpers.arrayElement(Object.values(EventType));
  event.startDateTime = faker.date.soon();
  event.endDateTime = faker.date.future({ refDate: event.startDateTime });
  return event;
});
