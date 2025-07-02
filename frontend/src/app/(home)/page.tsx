'use client';

import HeroSection from '@/components/ui/home/HeroSection';
import FeaturedEvents from '@/components/ui/home/FeaturedEvents';
import HighlightsPresentation from '@/components/ui/home/HighlightsPresentation';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturedEvents />
      <HighlightsPresentation />
    </main>
  );
}
