import { EventType } from '../entities/event-type.enum';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateEventDateTimeDto } from './create-event-date-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
  @IsNotEmpty()
  @MaxLength(255, { message: 'Location must be at most 255 characters' })
  location: string;

  @ApiProperty({
    name: 'dateTimes',
    description: 'The event dateTimes',
    type: [CreateEventDateTimeDto],
    example: 'Event dateTimes',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one date/time is required' })
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => CreateEventDateTimeDto) // Specify the type for validation
  dateTimes: CreateEventDateTimeDto[];
}
