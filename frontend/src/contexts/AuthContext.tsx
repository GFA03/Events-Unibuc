'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback
} from 'react';
import { useRouter } from 'next/navigation';
import { SignUpDto } from '@/features/auth/types/signUpDto';
import { LoginDto } from '@/features/auth/types/loginDto';
import { AuthenticatedUser } from '@/features/auth/model';
import { authService } from '@/features/auth/service';

// Define a type for the context value
interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  signup: (data: SignUpDto) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>; // Function to verify token on load
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('Initializing AuthProvider...');
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth check is done
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null);
    authService.removeToken();
    // Optionally clear react-query cache here if needed
    router.push('/auth/login'); // Redirect to login page
  }, [router]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const user = await authService.fetchUser();
      setUser(user);
    } catch (error: unknown) {
      // If /auth/me fails (e.g., token expired), log out
      console.error('Failed to fetch user profile:', error.response?.data || error.message);
      logout(); // Clear state and token if /me fails
    }
  }, [logout]);

  // Check auth status on initial load or when token might change
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    const token = authService.getToken();
    if (token) {
      await fetchUserProfile(); // Fetches profile, sets user, or logs out if invalid
    } else {
      setUser(null); // No token, not logged in
    }
    setIsLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // Run check on mount

  const login = async (credentials: LoginDto) => {
    setIsLoading(true);
    try {
      await authService.login(credentials); // This will store the token in localStorage
      await fetchUserProfile(); // Fetch profile after storing token to set user state
      router.push('/events'); // Redirect after successful login
    } catch (error: unknown) {
      // Re-throw for the form component to handle showing errors
      throw new Error(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignUpDto) => {
    setIsLoading(true);
    try {
      // Adjust according to whether signup automatically logs in
      await authService.signup(data);
      router.push('/auth/login?signupSuccess=true'); // Add query param for success message
    } catch (error: unknown) {
      console.error('Signup failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user, // True if user object exists
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
