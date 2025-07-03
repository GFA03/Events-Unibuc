import React from 'react';
import { Header } from '@/components/ui/layout/Header'; // Import your Header

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
