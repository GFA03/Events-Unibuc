import { mapToRole, Role } from '@/features/user/types/roles';
import { AuthenticatedUserDto } from '@/features/auth/types/AuthenticatedUserDto';

export class AuthenticatedUser {
  public readonly userId: string;
  public readonly role: Role;
  public readonly email: string;

  constructor(userId: string, role: Role, email: string) {
    this.userId = userId;
    this.role = role;
    this.email = email;
  }

  static fromDto(dto: AuthenticatedUserDto) {
    return new AuthenticatedUser(dto.userId, mapToRole(dto.role), dto.email);
  }
}
