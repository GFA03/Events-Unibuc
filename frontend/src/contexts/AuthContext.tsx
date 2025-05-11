'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { CreateUserDto } from "@/types/user/createUserDto";
import { LoginDto } from '@/types/loginDto';
import { User } from '@/types/user';

// Define a type for the context value
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    signup: (data: CreateUserDto) => Promise<void>;
    logout: () => void;
    checkAuthStatus: () => Promise<void>; // Function to verify token on load
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for token storage (client-side only)
const storeToken = (token: string) => localStorage.setItem('authToken', token);
const getToken = (): string | null => localStorage.getItem('authToken');
const removeToken = () => localStorage.removeItem('authToken');

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("Initializing AuthProvider...");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading until auth check is done
    const router = useRouter();

    const logout = useCallback(() => {
        setUser(null);
        removeToken();
        // Optionally clear react-query cache here if needed
        router.push('/login'); // Redirect to login page
    }, [router]);

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
            return response.data;
        } catch (error: any) {
            // If /auth/me fails (e.g., token expired), log out
            console.error('Failed to fetch user profile:', error.response?.data || error.message);
            logout(); // Clear state and token if /me fails
            return null;
        }
    }, [logout]);

    // Check auth status on initial load or when token might change
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        const token = getToken();
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
            const response = await apiClient.post<{ access_token: string }>('/auth/login', credentials);
            storeToken(response.data.access_token);
            await fetchUserProfile(); // Fetch profile after storing token
            router.push('/events'); // Redirect after successful login
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            // Re-throw for the form component to handle showing errors
            throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (data: CreateUserDto) => {
        setIsLoading(true);
        try {
            // Adjust according to whether signup automatically logs in
            await apiClient.post('/auth/signup', data);
            // Optional: Directly log in after signup or redirect to login page
            // For simplicity, redirect to login page with a success message
            router.push('/login?signupSuccess=true'); // Add query param for success message
            // Or attempt login automatically: await login({ email: data.email, password: data.password });
        } catch (error: any) {
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
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};