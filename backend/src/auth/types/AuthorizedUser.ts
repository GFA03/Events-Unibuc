import { Role } from '../../users/entities/role.enum';

export type AuthorizedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};
