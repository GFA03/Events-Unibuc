import { LoginDto } from '@/features/auth/types/loginDto';
import {
  apiForgotPasswordEmail,
  apiResendVerificationEmail,
  apiResetPassword,
  apiVerifyEmail,
  getAuthenticatedUser,
  loginRequest,
  signupRequest
} from '@/features/auth/api';
import { SignUpDto } from '@/features/auth/types/signUpDto';
import { AuthenticatedUser } from '@/features/auth/model';

const TOKEN_KEY = 'authToken';

class AuthService {
  storeToken(token: string) {
    // store in both localStorage and cookies
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
  }

  getToken(): string | null {
    // try local storage first, then cookies
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
      return localToken;
    }

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${TOKEN_KEY}=`));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }

  async login(credentials: LoginDto) {
    const { data } = await loginRequest(credentials);
    this.storeToken(data.access_token);
  }

  async signup(data: SignUpDto) {
    await signupRequest(data);
  }

  async verifyEmail(token: string) {
    const { data } = await apiVerifyEmail(token);
    return data;
  }

  async resendVerificationEmail(email: string) {
    const { data } = await apiResendVerificationEmail(email);
    return data;
  }

  async forgotPassword(email: string) {
    const { data } = await apiForgotPasswordEmail(email);
    return data;
  }

  async resetPassword(token: string, password: string) {
    const { data } = await apiResetPassword(token, password);
    return data;
  }

  async fetchUser(): Promise<AuthenticatedUser> {
    const { data } = await getAuthenticatedUser();
    return AuthenticatedUser.fromDto(data);
  }
}

export const authService = new AuthService();
