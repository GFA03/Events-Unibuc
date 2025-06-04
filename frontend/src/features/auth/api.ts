import { LoginDto } from '@/features/auth/types/loginDto';
import { SignUpDto } from '@/features/auth/types/signUpDto';
import { AuthenticatedUserDto } from '@/features/auth/types/AuthenticatedUserDto';
import apiClient from '@/lib/api';

export async function loginRequest(credentials: LoginDto) {
  return apiClient.post<{ access_token: string }>('/auth/login', credentials);
}

export async function signupRequest(data: SignUpDto) {
  return apiClient.post('/auth/signup', data);
}

export async function getAuthenticatedUser() {
  return apiClient.get<AuthenticatedUserDto>('/auth/me');
}
