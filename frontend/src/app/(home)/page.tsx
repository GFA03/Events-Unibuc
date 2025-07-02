'use client';

import { useEvents } from '@/features/event/hooks/useEvents';
import WithLoader from '@/components/ui/common/WithLoader';
import HeroSection from '@/components/ui/home/HeroSection';
import FeaturedEvents from '@/components/ui/home/FeaturedEvents';
import HighlightsPresentation from '@/components/ui/home/HighlightsPresentation';

export default function Home() {
  const { data, isLoading, isError } = useEvents();

  const events = data?.events || [];

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
