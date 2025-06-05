'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup';

  if (isAuthPage) return null;

  return <Header />;
}
