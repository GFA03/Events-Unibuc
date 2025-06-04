import { fetchTags } from '@/features/tag/api';

class TagService {
  async getTags() {
    const { data } = await fetchTags();
    return data;
  }
}

export const tagService = new TagService();
