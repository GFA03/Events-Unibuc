import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator'; // Import the decorator key
import { Role } from 'src/users/entities/role.enum';
import { AuthorizedUser } from './types/AuthorizedUser';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: AuthorizedUser; // Use optional property in case the guard runs before auth
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles() decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Check handler (method)
      context.getClass(), // Check class (controller)
    ]);

    // If no roles are specified, the route is public (or protected by other guards)
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (populated by JwtStrategy)
    // Assuming req.user has a 'role' property
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (!user) {
      return false;
    }

    // Check if the user's role is included in the required roles list
    return requiredRoles.some((role) => user.role === role);
  }
}
