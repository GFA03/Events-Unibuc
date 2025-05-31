'use client';

import { Button } from '@/components/common/Button';
import { Filters } from '../(hooks)/useEventsFilters';
import { EventType } from '@/types/event/eventType';
import { useTags } from '@/hooks/useTags';

interface EventsFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onTagToggle: (tagId: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isVisible: boolean;
}

export function EventsFilters({
  filters,
  onFilterChange,
  onTagToggle,
  onClearFilters,
  hasActiveFilters,
  isVisible
}: EventsFiltersProps) {
  const { data: availableTags } = useTags();

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Event Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All Types</option>
            {Object.values(EventType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="participants">Participants</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {/* Tags Filter Section */}
        {availableTags.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                    filters.tags.includes(tag.id)
                      ? 'text-white border-transparent shadow-sm'
                      : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: filters.tags.includes(tag.id) ? '#6B7280' : undefined
                  }}>
                  {tag.name}
                </button>
              ))}
            </div>

            {/* Show selected tags count */}
            {filters.tags.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {filters.tags.length} tag{filters.tags.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            onClick={onClearFilters}
            variant="secondary"
            disabled={!hasActiveFilters}
            className="whitespace-nowrap">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Search: {filters.search}
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Type: {filters.type}
              </span>
            )}
            {filters.startDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                From: {filters.startDate}
              </span>
            )}
            {filters.endDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                To: {filters.endDate}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
