import { Filters } from '@/features/event/types/eventFilters';

export interface UseEventFiltersOptions {
  limit?: number;
  onFiltersChange?: (filters: Filters) => void;
}
