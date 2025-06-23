import { setSeederFactory } from 'typeorm-extension';
import { Registration } from '../../../registrations/entities/registration.entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Registration, () => {
  const registration = new Registration();
  // registration.registrationDate = new Date();
  registration.registrationDate = faker.date.between({
    from: '2025-01-01',
    to: Date.now(),
  });
  return registration;
});
