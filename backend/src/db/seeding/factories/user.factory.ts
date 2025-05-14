import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../users/entities/role.enum';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../../utils/helpers';

export default setSeederFactory(User, async () => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = await hashPassword(faker.internet.password());
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.phoneNumber = faker.phone.number();
  user.role = Role.USER;
  return user;
});
