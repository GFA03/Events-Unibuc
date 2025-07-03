'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Role } from '@/features/user/types/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  if (isLoading) return null;

  return (
    <Suspense fallback={<LoadingSpinner />}>
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

            {isAuthenticated ? (
              <>
                {user?.role === Role.User && (
                  <Link href="/registrations" className="text-white hover:text-indigo-600">
                    My Registrations
                  </Link>
                )}
                {(user?.role === Role.Admin || user?.role === Role.Organizer) && (
                  <>
                    <Link href="/manage-events" className="text-white hover:text-indigo-600">
                      Manage Events
                    </Link>
                  </>
                )}

                {user?.role === Role.Admin && (
                  <>
                    <Link href="/admin" className="text-white hover:text-indigo-600">
                      Admin Panel
                    </Link>
                  </>
                )}
                {user?.role === Role.Organizer && (
                  <>
                    <Link href="/dashboard" className="text-white hover:text-indigo-600">
                      Dashboard
                    </Link>
                  </>
                )}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-white cursor-pointer hover:text-indigo-200 focus:outline-none">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      {user?.email ? (
                        <span className="text-sm font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      ) : null}
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}>
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white hover:text-indigo-600">
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </Suspense>
  );
}
