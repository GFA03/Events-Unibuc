import { mapToRole, Role } from '@/features/user/types/roles';
import { AuthenticatedUserDto } from '@/features/auth/types/AuthenticatedUserDto';

export class AuthenticatedUser {
  public readonly id: string;
  public readonly role: Role;
  public readonly email: string;

  constructor(id: string, role: Role, email: string) {
    this.id = id;
    this.role = role;
    this.email = email;
  }

  static fromDto(dto: AuthenticatedUserDto) {
    return new AuthenticatedUser(dto.id, mapToRole(dto.role), dto.email);
  }
}
