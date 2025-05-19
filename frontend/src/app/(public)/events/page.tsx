'use client';

import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/hooks/useEvents';
import WithLoader from '@/components/common/WithLoader';

export default function EventsPage() {
  const { data: events = [], isLoading, isError } = useEvents();

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load events...'}>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">All Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </WithLoader>
  );
}
