import { Tag } from '@/features/tag/types/tag';

export interface TagWithCount extends Tag {
  count: number;
}