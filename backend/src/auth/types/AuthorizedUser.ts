import { Role } from '../../users/entities/role.enum';

export type AuthorizedUser = {
  userId: string;
  email: string;
  role: Role;
};
