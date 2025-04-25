import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  MinDate,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isEndDateTimeAfterStartDate', async: false })
export class IsEndDateTimeAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDateTime: Date, args: ValidationArguments) {
    const object = args.object as CreateEventDateTimeDto;
    if (!object.startDateTime || !endDateTime) {
      return false; // Don't validate if one is missing (handled by IsNotEmpty)
    }
    return endDateTime.getTime() > object.startDateTime.getTime();
  }

  defaultMessage(_args: ValidationArguments) {
    return 'End date ($value) must be after start date';
  }
}

export class CreateEventDateTimeDto {
  @ApiProperty({ example: '2025-10-20T09:00:00.000Z' })
  @IsNotEmpty({ message: 'Start date/time is required' })
  @Type(() => Date) // Transform incoming string/number to Date
  @IsDate({ message: 'Invalid start date format' })
  @MinDate(new Date(), { message: 'Start date must be in the future'})
  startDateTime: Date;

  @ApiProperty({ example: '2025-10-20T17:00:00.000Z' })
  @IsNotEmpty({ message: 'End date/time is required' })
  @Type(() => Date)
  @IsDate({ message: 'Invalid end date format' })
  @Validate(IsEndDateTimeAfterStartDateConstraint)
  endDateTime: Date;
}
