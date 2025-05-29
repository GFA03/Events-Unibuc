'use client';

import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/hooks/events/useEvents';
import WithLoader from '@/components/common/WithLoader';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faCalendarDays,
  faLocationDot,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faSlidersH,
  faUsers,
  faTicket
} from '@fortawesome/free-solid-svg-icons';

interface Filters {
  search: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'name' | 'participants';
  sortOrder: 'asc' | 'desc';
}

export default function EventsPage() {
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  const limit = 12;
  const offset = page * limit;

  // Build query parameters
  const queryParams = {
    limit,
    offset,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.location && { location: filters.location }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  };

  const { data, isLoading, isError } = useEvents(queryParams);
  const events = data?.events || [];
  const totalCount = data?.total || 0;

  const isLastPage = offset + limit >= totalCount;
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = page + 1;

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      location: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = Object.values(filters).some((value, index) => {
    if (index >= 5) return false; // Skip sortBy and sortOrder
    return value !== '';
  });

  const eventTypes = ['EVENT', 'WORKSHOP']; // You can make this dynamic from API

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load events...'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Discover Events
                </h1>
                <p className="text-gray-600 text-lg">Find amazing events happening around you</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FontAwesomeIcon icon={faTicket} className="text-indigo-500" />
                    <span>{totalCount} events available</span>
                  </div>
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FontAwesomeIcon icon={faFilter} />
                      <span>Filters active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 font-medium ${
                    showFilters || hasActiveFilters
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}>
                  <FontAwesomeIcon icon={faSlidersH} />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Events
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search by name or description..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 bg-white">
                    <option value="">All Types</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="Filter by location..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 bg-white">
                      <option value="date">Date</option>
                      <option value="name">Name</option>
                      <option value="participants">Participants</option>
                    </select>
                    <button
                      onClick={() =>
                        handleFilterChange(
                          'sortOrder',
                          filters.sortOrder === 'asc' ? 'desc' : 'asc'
                        )
                      }
                      className={`px-4 py-3 rounded-xl border border-gray-200 transition-all duration-200 hover:bg-gray-50 ${
                        filters.sortOrder === 'desc' ? 'bg-gray-100' : ''
                      }`}
                      title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                      {filters.sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date From
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date To
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      min={filters.startDate}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 font-medium">
                      <FontAwesomeIcon icon={faXmark} />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faTicket} className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters to find more events'
                  : 'There are no events available at the moment'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-medium">
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-500" />
                    <span>
                      Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount}{' '}
                      events
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(p - 1, 0))}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 font-medium">
                      <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1 mx-4">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum - 1)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 hover:scale-110 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}>
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={isLastPage}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 font-medium">
                      Next
                      <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WithLoader>
  );
}
