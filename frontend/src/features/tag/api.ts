import { Tag } from '@/features/tag/types/tag';
import apiClient from '@/lib/api';
import { TagWithCount } from '@/features/tag/types/tagWithCount';
import { CreateTagDto } from '@/features/tag/types/createTagDto';

export async function apiCreateTag(tag: CreateTagDto) {
  return apiClient.post<Tag>('/tags', tag, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function apiUpdateTag(id: string, data: Partial<Tag>) {
  return apiClient.patch<Tag>(`/tags/${id}`, data);
}

export async function fetchTags() {
  return apiClient.get<Tag[]>('/tags');
}

export async function fetchTagsWithEventCount() {
  return apiClient.get<TagWithCount[]>('/tags/events');
}

export async function apiDeleteTag(id: string) {
  return apiClient.delete(`/tags/${id}`);
}