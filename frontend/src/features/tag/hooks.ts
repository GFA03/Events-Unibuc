import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/features/tag/service';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
}
