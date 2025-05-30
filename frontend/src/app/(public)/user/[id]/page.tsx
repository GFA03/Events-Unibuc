'use client';

import { useParams } from 'next/navigation';
import { useOrganizer } from '@/hooks/users/useOrganizer';
import WithLoader from '@/components/common/WithLoader';
import EventCard from '@/components/events/EventCard';

export default function OrganizerPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { data: organizer, isLoading, isError } = useOrganizer(id);

  console.log(organizer);

  if (!organizer) {
    return <p>Organizer not found!</p>;
  }

  const { firstName, lastName, organizedEvents } = organizer;

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage="Failed to load organizer">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          {firstName} {lastName} Page
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {organizedEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}>
              <EventCard event={event} viewMode="grid" />
            </div>
          ))}
        </div>
      </div>
    </WithLoader>
  );
}
