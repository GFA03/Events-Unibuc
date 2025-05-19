// components/common/WithLoader.tsx
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface WithLoaderProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  children: React.ReactNode;
}

export default function WithLoader({
  isLoading,
  isError,
  errorMessage = 'Failed to load data...',
  children
}: WithLoaderProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">{errorMessage}</p>;
  }

  return <>{children}</>;
}
