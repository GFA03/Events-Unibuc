import { Event } from '@/features/event/model';
import EventCard from '@/components/events/EventCard';

interface EventsGridProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  viewMode?: 'grid' | 'list';
}

export function EventsGrid({
  events,
  isLoading,
  isError,
  error,
  viewMode = 'grid'
}: EventsGridProps) {
  // Loading State
  if (isLoading) {
    const skeletonCount = 12;
    return (
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
        {[...Array(skeletonCount)].map((_, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${
              viewMode === 'list' ? 'flex h-32' : 'h-64'
            }`}>
            {viewMode === 'list' ? (
              <>
                <div className="w-48 bg-gray-200"></div>
                <div className="flex-1 p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </>
            ) : (
              <>
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load events</h3>
          <p className="text-red-600 mb-4">
            {error?.message || 'Something went wrong while fetching events.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more events.
          </p>
        </div>
      </div>
    );
  }

  // Events Grid
  return (
    <div
      className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} viewMode={viewMode} />
      ))}
    </div>
  );
}
