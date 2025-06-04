'use client';

import { LoginForm } from '@/features/auth/components/LoginForm';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
        <Link href={'/'}>
          <Image
            src={'/unibuc-logo.webp'}
            alt={'Universitatea Bucuresti Logo'}
            width={200}
            height={200}
            className="mx-auto mb-6"
          />
        </Link>
        <h2 className="text-2xl text-white font-bold text-center mb-6">Conectați-vă</h2>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-white">
          Don&#39;t have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-200 hover:text-indigo-50">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
