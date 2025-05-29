'use client';

import { useMyEvents } from '@/hooks/events/useMyEvents';
import WithLoader from '@/components/common/WithLoader';
import EventCard from '@/components/events/EventCard';
import CreateEventCard from '@/components/events/CreateEventCard';

export default function ManageEvents() {
  const { data: myEvents = [], isLoading, isError } = useMyEvents();

  return (
    <WithLoader
      isLoading={isLoading}
      isError={isError}
      errorMessage={'Failed to get your events...'}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateEventCard />
          {myEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </WithLoader>
  );
}
