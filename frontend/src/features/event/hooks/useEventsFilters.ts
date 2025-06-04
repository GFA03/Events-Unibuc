import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UseEventFiltersOptions } from '@/features/event/types/useEventFiltersOptions';
import { Filters } from '@/features/event/types/eventFilters';

export function useEventsFilters({ limit = 12, onFiltersChange }: UseEventFiltersOptions = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortBy: (searchParams.get('sortBy') as Filters['sortBy']) || 'date',
    sortOrder: (searchParams.get('sortOrder') as Filters['sortOrder']) || 'asc',
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || []
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
    ...(filters.tags.length > 0 && { tags: filters.tags.join(',') }),
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
      if (key === 'tags') {
        // Handle tags array specially
        const tagArray = value as string[];
        if (tagArray.length > 0) {
          params.set(key, tagArray.join(','));
        }
      } else if (value && value !== '') {
        params.set(key, value as string);
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
      sortOrder: (searchParams.get('sortOrder') as Filters['sortOrder']) || 'asc',
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || []
    };

    setFilters(newFilters);
  }, [searchParams]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Special handler for tag filtering
  const handleTagToggle = useCallback((tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'asc',
      tags: []
    });
    router.push('/events');
  }, [router]);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    // Don't count sortBy and sortOrder as active filters
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'tags') return (value as string[]).length > 0;
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
    handleTagToggle,
    clearFilters
  };
}
