import { Request as ExpressRequest } from 'express';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export interface RequestWithUserResponse extends ExpressRequest {
  user: UserResponseDto;
}
