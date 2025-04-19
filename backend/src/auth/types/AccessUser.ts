import { Role } from '../../users/entities/role.enum';

export type AccessUser = {
  userId: string;
  email: string;
  role: Role;
};
