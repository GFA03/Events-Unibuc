import { LoginDto } from '@/features/auth/types/loginDto';
import { getAuthenticatedUser, loginRequest, signupRequest } from '@/features/auth/api';
import { SignUpDto } from '@/features/auth/types/signUpDto';
import { AuthenticatedUser } from '@/features/auth/model';

const TOKEN_KEY = 'authToken';

class AuthService {
  storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async login(credentials: LoginDto) {
    const { data } = await loginRequest(credentials);
    this.storeToken(data.access_token);
  }

  async signup(data: SignUpDto) {
    await signupRequest(data);
  }

  async fetchUser(): Promise<AuthenticatedUser> {
    const { data } = await getAuthenticatedUser();
    return AuthenticatedUser.fromDto(data);
  }
}

export const authService = new AuthService();
