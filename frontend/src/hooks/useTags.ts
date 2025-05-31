import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@/types/tag';

// Fetch all tags from the API
function fetchTags() {
  const response = await apiClient.get<Tag[]>('/tags');
  return response.data;
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
}
