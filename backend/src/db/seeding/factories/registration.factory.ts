import { setSeederFactory } from 'typeorm-extension';
import { Registration } from '../../../registrations/entities/registration.entity';

export default setSeederFactory(Registration, () => {
  const registration = new Registration();
  registration.registrationDate = new Date();
  return registration;
});
