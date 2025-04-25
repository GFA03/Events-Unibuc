import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { CreateEventDateTimeDto } from './create-event-date-time.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // Explicitly make dateTimes optional for update operations
  // Managing dateTimes (add/remove/update individual) is better handled
  // via dedicated endpoints (/events/:id/datetimes) but allow updating
  // the whole array if needed (less common for PATCH).
  @ApiProperty({ type: [CreateEventDateTimeDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDateTimeDto)
  dateTimes?: CreateEventDateTimeDto[];
}
