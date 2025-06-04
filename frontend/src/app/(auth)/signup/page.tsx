'use client';

import { SignupForm } from '@/features/auth/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Sign Up</h2>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-white">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-100 hover:text-indigo-50">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
