import React from 'react';
import { Header } from '@/components/ui/layout/Header'; // Import your Header

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
