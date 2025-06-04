'use client';

import { useEvents } from '@/features/event/hooks/useEvents';
import WithLoader from '@/components/ui/common/WithLoader';
import { useState } from 'react';
import EventsHeader from '@/features/event/components/EventsHeader';
import { useEventsFilters } from '@/features/event/hooks/useEventsFilters';
import { EventsToolbar } from '@/features/event/components/EventsToolbar';
import { EventsFilters } from '@/features/event/components/EventsFilters';
import { EventsGrid } from '@/features/event/components/EventsGrid';
import { Pagination } from '@/components/ui/common/Pagination';

export default function EventsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    page,
    filters,
    queryParams,
    hasActiveFilters,
    setPage,
    handleTagToggle,
    handleFilterChange,
    clearFilters
  } = useEventsFilters({
    limit: 12
  });

  const { data, isLoading, isError, error } = useEvents(queryParams);

  const events = data?.events || [];
  const totalCount = data?.total || 0;
  const isLastPage = queryParams.offset + queryParams.limit >= totalCount;
  const totalPages = Math.ceil(totalCount / queryParams.limit);
  const currentPage = page + 1;

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load events...'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <EventsHeader totalCount={totalCount} />
        {/* Toolbar */}
        <EventsToolbar
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        Filters
        <EventsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onTagToggle={handleTagToggle}
          hasActiveFilters={hasActiveFilters}
          isVisible={showFilters}
        />
        {/* Events Grid */}
        <EventsGrid
          events={events}
          isLoading={isLoading}
          isError={isError}
          error={error}
          viewMode={viewMode}
        />
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLastPage={isLastPage}
          onPageChange={(newPage) => setPage(newPage - 1)}
          isLoading={isLoading}
        />
      </div>
    </WithLoader>
  );
}
