import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  redirectWhen?: 'authenticated' | 'unauthenticated';
  condition?: () => boolean;
}

export function useAuthRedirect({
  redirectTo = '/events',
  redirectWhen = 'authenticated',
  condition
}: UseAuthRedirectOptions = {}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) return;

    // Check custom condition if provided
    if (condition && !condition()) return;

    const shouldRedirect =
      (redirectWhen === 'authenticated' && isAuthenticated) ||
      (redirectWhen === 'unauthenticated' && !isAuthenticated);

    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, redirectWhen, condition]);

  return { isAuthenticated, isLoading };
}
