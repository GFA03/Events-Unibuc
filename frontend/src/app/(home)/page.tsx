'use client';

import { useEvents } from '@/hooks/events/useEvents';
import WithLoader from '@/components/common/WithLoader';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import HeroSection from '@/app/(home)/(components)/HeroSection';
import FeaturedEvents from '@/app/(home)/(components)/FeaturedEvents';
import HighlightsPresentation from '@/app/(home)/(components)/HighlightsPresentation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Home() {
  const { data, isLoading, isError, error } = useEvents();

  console.log('Home page data:', data, 'Loading:', isLoading, 'Error:', isError);
  console.log('Home page error:', error);

  const { isLoading: authLoading } = useAuthRedirect({
    redirectTo: '/events',
    redirectWhen: 'authenticated'
  });

  const events = data?.events || [];

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <WithLoader isLoading={isLoading} isError={isError}>
      <main className="w-full">
        <HeroSection />
        <FeaturedEvents events={events} />
        <HighlightsPresentation />
      </main>
    </WithLoader>
  );
}
