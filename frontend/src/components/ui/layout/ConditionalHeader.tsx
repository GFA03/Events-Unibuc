'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/auth/login' ||
    pathname === '/auth/signup' ||
    pathname === '/auth/forgot-password' ||
    pathname === '/auth/verify-email';

  if (isAuthPage) return null;

  return <Header />;
}
