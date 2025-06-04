export interface EventsQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
}
