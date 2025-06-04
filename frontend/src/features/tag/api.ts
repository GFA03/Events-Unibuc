import { Tag } from '@/features/tag/types/tag';
import apiClient from '@/lib/api';

export async function fetchTags() {
  return apiClient.get<Tag[]>('/tags');
}
