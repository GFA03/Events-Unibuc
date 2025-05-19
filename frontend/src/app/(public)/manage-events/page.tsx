'use client';

import { useMyEvents } from '@/hooks/useMyEvents';
import WithLoader from '@/components/common/WithLoader';

export default function ManageEvents() {
  const { data: myEvents = [], isLoading, isError, error } = useMyEvents();

  console.error(error);

  return (
    <WithLoader
      isLoading={isLoading}
      isError={isError}
      errorMessage={'Failed to get your events...'}>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Events</h1>
        {myEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="space-y-2">
            {myEvents.map((event) => (
              <li key={event.id} className="bg-gray-100 rounded-md p-4">
                <p className="font-semibold">{event.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.dateTimes[0].startDateTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </WithLoader>
  );
}
