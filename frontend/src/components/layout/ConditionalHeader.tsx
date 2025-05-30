'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function ConditionalHeader({
  isBackgroundTransparent = false
}: {
  isBackgroundTransparent?: boolean;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) return null;

  return <Header isBackgroundTransparent={isBackgroundTransparent} />;
}
