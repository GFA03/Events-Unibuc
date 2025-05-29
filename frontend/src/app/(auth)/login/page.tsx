'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/events');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-white">
          Don&#39;t have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-100 hover:text-indigo-50">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
