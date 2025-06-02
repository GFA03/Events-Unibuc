'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import Image from 'next/image';
import { Role } from '@/types/user/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (searchTerm: string) => {
    if (onSearch) {
      // If parent component provides onSearch callback, use it
      onSearch(searchTerm);
    } else {
      // Otherwise, navigate to events page with search parameter
      const params = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      } else {
        params.delete('search');
      }
      router.push(`/events?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(search);
    }
  };

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
  }, [searchParams]);

  return (
    <header className={`shadow-md sticky top-0 z-50 bg-cyan-600`}>
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={isAuthenticated ? '/events' : '/'}>
          <Image
            src={'/unibuc-logo.webp'}
            alt={'Universitatea Bucuresti Evenimente'}
            width={100}
            height={100}
            priority={true}
            className="cursor-pointer"
          />
        </Link>
        <div className="relative flex-1 max-w-md mx-8">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, description or location..."
            className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/events" className="text-white hover:text-indigo-600">
            Events
          </Link>
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link href="/registrations" className="text-white hover:text-indigo-600">
                My Registrations
              </Link>
              {/* Conditionally show Admin links */}
              {user?.role === Role.Admin && (
                <>
                  <Link href="/manage-events" className="text-white hover:text-indigo-600">
                    Manage Events
                  </Link>
                  <Link href="/admin" className="text-white hover:text-indigo-600">
                    Admin Panel
                  </Link>
                </>
              )}
              {user?.role === Role.Organizer && (
                <>
                  <Link href="/manage-events" className="text-white hover:text-indigo-600">
                    Manage My Events
                  </Link>
                  <Link href="/dashboard" className="text-white hover:text-indigo-600">
                    Dashboard
                  </Link>
                </>
              )}
              <span className="text-sm text-gray-300 hidden sm:block">Hi, {user?.email}</span>
              <Button onClick={logout} variant="secondary" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-indigo-600">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
