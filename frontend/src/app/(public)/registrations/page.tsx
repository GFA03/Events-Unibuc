'use client';

import EventCard from '@/components/events/EventCard';
import { useRegistrations } from '@/app/(public)/registrations/(hooks)/useRegistrations';
import WithLoader from '@/components/common/WithLoader';

export default function RegistrationsPage() {
  const { data: registrations, isError, isLoading } = useRegistrations();

  if (!registrations || registrations.length === 0) {
    return (
      <WithLoader
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load registrations">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
          <p>No registrations yet.</p>
        </div>
      </WithLoader>
    );
  }

  const events = registrations.map((reg) => reg.event);

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage="Failed to load registrations">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
        {registrations.length === 0 ? (
          <p>No registrations yet.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} viewMode="list" />
            ))}
          </ul>
        )}
      </div>
    </WithLoader>
  );
}
