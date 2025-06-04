'use client'; // Needs client-side hooks for auth check

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner'; // Create a spinner component

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Render children only if not authenticated (or still loading)
  return (
    <div className="min-h-screen bg-cyan-700">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
