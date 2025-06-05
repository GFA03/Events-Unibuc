import { Role } from '../../users/entities/role.enum';

export type AuthorizedUser = {
  id: string;
  email: string;
  role: Role;
};
