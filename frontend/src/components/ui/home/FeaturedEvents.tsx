import EventCard from '@/components/events/EventCard';
import Link from 'next/link';
import { useEvents } from '@/features/event/hooks/useEvents';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';

export default function FeaturedEvents() {
  return (
    <section className="min-h-screen w-full bg-orange-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8">Upcoming events</h2>
        <EventLoader />
        <div className="text-right">
          <Link
            href="/events"
            className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
            See all events
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventLoader() {
  const { data } = useEvents();

  const events = data?.events || [];

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.slice(0, 6).map((event) => (
          <EventCard key={event.id} event={event} viewMode="grid" />
        ))}
      </div>
    </Suspense>
  );
}
