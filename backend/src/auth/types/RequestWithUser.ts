import { AuthorizedUser } from './AuthorizedUser';
import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user: AuthorizedUser;
}
