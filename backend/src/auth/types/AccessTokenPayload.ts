import { Role } from '../../users/entities/role.enum';

export interface AccessTokenPayload {
  email: string;
  sub: string; // user id
  role: Role;
}
