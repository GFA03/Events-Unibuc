import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/features/tag/service';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
}

export function useTagsWithEventCount() {
  return useQuery({
    queryKey: ['tagsEvents'],
    queryFn: tagService.getTagsWithEventCount,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
