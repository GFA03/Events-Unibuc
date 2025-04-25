import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import { UsersService } from '../users/users.service';
import { AuthorizedUser } from './types/AuthorizedUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Called automatically by Passport after verifying the JWT signature and expiration.
   * @param payload The decoded and verified JWT payload.
   * @returns The object to be attached to the Express Request as `req.user`.
   * @throws UnauthorizedException if payload is invalid or further checks fail.
   */
  async validate(payload: AccessTokenPayload): Promise<AuthorizedUser> {
    const user = await this.usersService.findByPayload(payload);

    if (!user) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return { userId: user.id, email: user.email, role: user.role };
  }
}
