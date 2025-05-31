import { Tag } from '../entities/tag.entity';

export class TagResponseDto {
  id: string;
  name: string;

  static from(tag: Tag) {
    const dto = new TagResponseDto();
    dto.id = tag.id;
    dto.name = tag.name;
    return dto;
  }
}
