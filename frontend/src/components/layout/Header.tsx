'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import Image from 'next/image';
import { Role } from '@/types/user/roles';

interface HeaderProps {
  isBackgroundTransparent?: boolean;
}

export function Header(
  { isBackgroundTransparent }: HeaderProps = { isBackgroundTransparent: false }
) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  console.log(`isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);

  return (
    <header
      className={`shadow-md sticky top-0 z-50 ${isBackgroundTransparent ? 'bg-transparent' : 'bg-cyan-600'}`}>
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={isAuthenticated ? '/events/' : '/'}>
          <Image
            src={'/unibuc-logo.webp'}
            alt={'Universitatea Bucuresti Evenimente'}
            width={100}
            height={100}
            priority={true}
            className="cursor-pointer"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/events" className="text-white hover:text-indigo-600">
            Events
          </Link>
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link href="/registrations" className="text-gray-600 hover:text-indigo-600">
                My Registrations
              </Link>
              {/* Conditionally show Admin links */}
              {user?.role === Role.ADMIN && (
                <Link
                  href="/manage-events"
                  className="text-gray-600 hover:text-indigo-600 font-medium">
                  Manage Events
                </Link>
              )}
              {user?.role === Role.ORGANIZER && (
                <Link
                  href="/manage-events"
                  className="text-gray-600 hover:text-indigo-600 font-medium">
                  Manage My Events
                </Link>
              )}
              <span className="text-sm text-gray-700 hidden sm:block">Hi, {user?.email}</span>
              <Button onClick={logout} variant="secondary" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-indigo-600">
                Login
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
