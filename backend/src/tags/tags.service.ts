import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { TagResponseDto } from './dto/tag-response.dto';
import { TagWithEventCountDto } from './dto/tag-with-event-count.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    this.logger.log('Creating new tag: ', createTagDto.name);
    const existingTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name.toLowerCase() },
    });

    if (existingTag) {
      throw new ConflictException('Tag with this name already exists');
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      name: createTagDto.name.toLowerCase(), // Store tags in lowercase for consistency
    });

    this.logger.log('Successfully created tag: ', tag);

    return await this.tagRepository.save(tag);
  }

  async findAll(): Promise<TagResponseDto[]> {
    this.logger.log('Fetching all tags');
    return this.tagRepository
      .find({
        order: { name: 'ASC' },
      })
      .then((tags) => tags.map((tag) => TagResponseDto.from(tag)));
  }

  async findAllWithEventCount(): Promise<TagWithEventCountDto[]> {
    this.logger.log('Fetching all tags with event count');
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.events', 'event')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(event.id)', 'eventCount')
      .groupBy('tag.id')
      .orderBy('tag.name', 'ASC')
      .getRawMany();

    return tags.map((t: Tag & { eventCount: string }) => ({
      id: t.id,
      name: t.name,
      count: parseInt(t.eventCount, 10),
    }));
  }

  // Find tag by ID, if not found throw NotFoundException
  async findOne(id: string): Promise<Tag> {
    this.logger.log(`Fetching tag with id: ${id}`);
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['events'],
    });

    if (!tag) {
      this.logger.warn(`Tag with id ${id} not found`);
      throw new NotFoundException(`Tag not found`);
    }

    this.logger.log(`Found tag: ${tag.name}`);
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    this.logger.log(`Updating tag with id: ${id}`);

    const tag = await this.findOne(id);

    // If updating name, check for conflicts
    if (updateTagDto.name && updateTagDto.name.toLowerCase() !== tag.name) {
      const existingTag = await this.tagRepository.findOne({
        where: { name: updateTagDto.name.toLowerCase() },
      });

      if (existingTag && existingTag.id !== id) {
        this.logger.warn(`Tag with name ${updateTagDto.name} already exists`);
        throw new ConflictException('Tag with this name already exists');
      }
    }

    Object.assign(tag, {
      ...updateTagDto,
      name: updateTagDto.name ? updateTagDto.name.toLowerCase() : tag.name,
    });

    return await this.tagRepository.save(tag);
  }

  async remove(id: string) {
    this.logger.log(`Removing tag with id: ${id}`);
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) return [];

    return await this.tagRepository.findBy({ id: In(ids) });
  }
}
