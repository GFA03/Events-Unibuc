import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

library.add(fas);

import { AppProviders } from '@/providers/AppProviders';
import { ConditionalHeader } from '@/components/ui/layout/ConditionalHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'University Events App',
  description: 'Find and register for university events and workshops.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AppProviders>
          {/*<Suspense fallback={<LoadingSpinner />}>*/}
          <ConditionalHeader />
          <main className="min-h-screen">{children}</main>
          {/*</Suspense>*/}
        </AppProviders>
      </body>
    </html>
  );
}
