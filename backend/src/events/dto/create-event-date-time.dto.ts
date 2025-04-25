import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEndDateTimeAfterStartDateConstraint } from '../constraints/is-end-date-time-after-start-date-constraint';

export class CreateEventDateTimeDto {
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
