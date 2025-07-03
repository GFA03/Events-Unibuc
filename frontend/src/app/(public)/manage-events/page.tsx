'use client';

import { useMyEvents } from '@/features/event/hooks/useMyEvents';
import WithLoader from '@/components/ui/common/WithLoader';
import EventCard from '@/components/events/EventCard';
import CreateEventCard from '@/features/event/components/CreateEventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageEvents() {
  const { user, isLoading: isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      // Redirect or show an error if the user is not an organizer or admin
      router.push('/events');
    }
  }, [router, user]);

  const { data: myEvents = [], isLoading, isError } = useMyEvents();

  return (
    <WithLoader
      isLoading={isLoading || isUserLoading}
      isError={isError}
      errorMessage={'Failed to get your events...'}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateEventCard />
          {myEvents.map((event) => (
            <EventCard key={event.id} event={event} viewMode="grid" />
          ))}
        </div>
      </div>
    </WithLoader>
  );
}
