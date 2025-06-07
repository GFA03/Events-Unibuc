import { apiCreateTag, apiDeleteTag, apiUpdateTag, fetchTags, fetchTagsWithEventCount } from '@/features/tag/api';
import { CreateTagDto } from '@/features/tag/types/createTagDto';
import { Tag } from '@/features/tag/types/tag';

class TagService {
  async createTag(tag: CreateTagDto) {
    return apiCreateTag(tag);
  }

  async updateTag(id: string, tag: Partial<Tag>) {
    return apiUpdateTag(id, tag)
  }

  async getTags() {
    const { data } = await fetchTags();
    return data;
  }

  async getTagsWithEventCount() {
    const { data } = await fetchTagsWithEventCount();
    return data;
  }

  async deleteTag(id: string) {
    await apiDeleteTag(id);
  }
}

export const tagService = new TagService();
