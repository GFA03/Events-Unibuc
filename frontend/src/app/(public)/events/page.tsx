'use client';

import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/hooks/useEvents';
import WithLoader from '@/components/common/WithLoader';
import { useState } from 'react';

export default function EventsPage() {
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;

  const { data, isLoading, isError } = useEvents({ limit, offset });
  const events = data?.events || [];
  const totalCount = data?.total || 0;

  const isLastPage = offset + limit >= totalCount;

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load events...'}>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">All Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Previous
          </button>
          <button
            disabled={isLastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </WithLoader>
  );
}
