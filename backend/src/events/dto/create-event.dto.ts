import { EventType } from '../entities/event-type.enum';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  MinDate,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEndDateTimeAfterStartDateConstraint } from '../constraints/is-end-date-time-after-start-date-constraint';
import { Tag } from '../../tags/entities/tag.entity';

export class CreateEventDto {
  @ApiProperty({
    name: 'name',
    description: 'The event name',
    type: String,
    example: 'Event name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  name: string;

  @ApiProperty({
    name: 'type',
    description: 'The event type',
    type: String,
    example: 'EVENT',
    enum: EventType,
  })
  @IsNotEmpty()
  @IsString()
  type: EventType;

  @ApiProperty({
    name: 'tags',
    description: 'The event tags',
    type: [Tag],
    example: '["tag1", "tag2"]',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiProperty({
    name: 'description',
    description: 'The event description',
    type: String,
    example: 'Event description',
  })
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;

  @ApiProperty({
    name: 'location',
    description: 'The event location',
    type: String,
    example: 'Event location',
  })
  @MaxLength(255, { message: 'Location must be at most 255 characters' })
  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Max(1000, { message: 'Maximum number of participants cannot exceed 1000' })
  noParticipants: number;

  @ApiProperty({ example: '2025-10-20T09:00:00.000Z' })
  @IsNotEmpty({ message: 'Start date/time is required' })
  @Type(() => Date) // Transform incoming string/number to Date
  @IsDate({ message: 'Invalid start date format' })
  @MinDate(new Date(), { message: 'Start date must be in the future' })
  startDateTime: Date;

  @ApiProperty({ example: '2025-10-20T17:00:00.000Z' })
  @IsNotEmpty({ message: 'End date/time is required' })
  @Type(() => Date)
  @IsDate({ message: 'Invalid end date format' })
  @Validate(IsEndDateTimeAfterStartDateConstraint)
  endDateTime: Date;
}
