export interface Filters {
  search: string;
  type: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'name' | 'participants';
  sortOrder: 'asc' | 'desc';
  tags: string[]; // Filtering by tag ids
}
