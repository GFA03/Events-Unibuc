import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface Filters {
  search: string;
  type: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'name' | 'participants';
  sortOrder: 'asc' | 'desc';
}

interface UseEventsFiltersOptions {
  limit?: number;
  onFiltersChange?: (filters: Filters) => void;
}

export function useEventsFilters({ limit = 12, onFiltersChange }: UseEventsFiltersOptions = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortBy: (searchParams.get('sortBy') as Filters['sortBy']) || 'date',
    sortOrder: (searchParams.get('sortOrder') as Filters['sortOrder']) || 'asc'
  });

  const offset = page * limit;

  // Build query parameters for API
  const queryParams = {
    limit,
    offset,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  // Sync URL params with filters
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });

    const newUrl = params.toString() ? `/events?${params.toString()}` : '/events';
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Sync filters with URL params on mount/navigation
  useEffect(() => {
    const newFilters: Filters = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      sortBy: (searchParams.get('sortBy') as Filters['sortBy']) || 'date',
      sortOrder: (searchParams.get('sortOrder') as Filters['sortOrder']) || 'asc'
    };

    setFilters(newFilters);
  }, [searchParams]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'asc'
    });
    router.push('/events');
  }, [router]);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    // Don't count sortBy and sortOrder as active filters
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== '';
  });

  return {
    // State
    page,
    filters,
    queryParams,
    hasActiveFilters,

    // Pagination helpers
    limit,
    offset,

    // Actions
    setPage,
    handleFilterChange,
    clearFilters
  };
}
