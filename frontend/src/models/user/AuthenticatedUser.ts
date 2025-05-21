import { mapToRole, Role } from '@/types/user/roles';
import { AuthenticatedUserResponse } from '@/types/AuthenticatedUserResponse';

export class AuthenticatedUser {
  public readonly userId: string;
  public readonly role: Role;
  public readonly email: string;

  constructor(userId: string, role: Role, email: string) {
    this.userId = userId;
    this.role = role;
    this.email = email;
  }

  static fromDto(dto: AuthenticatedUserResponse) {
    return new AuthenticatedUser(dto.userId, mapToRole(dto.role), dto.email);
  }
}
