import EventCard from '@/components/events/EventCard';
import { Event } from '@/models/event/Event';
import Link from 'next/link';

export default function FeaturedEvents({ events }: { events: Event[] }) {
  return (
    <section className="min-h-screen w-full bg-orange-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8">Upcoming events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
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
