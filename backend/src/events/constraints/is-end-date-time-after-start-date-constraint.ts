import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateEventDto } from '../dto/create-event.dto';

@ValidatorConstraint({ name: 'isEndDateTimeAfterStartDate', async: false })
export class IsEndDateTimeAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDateTime: Date, args: ValidationArguments) {
    const object = args.object as CreateEventDto;
    if (!object.startDateTime || !endDateTime) {
      return false; // Don't validate if one is missing (handled by IsNotEmpty)
    }
    return endDateTime.getTime() > object.startDateTime.getTime();
  }

  defaultMessage(_args: ValidationArguments) {
    return 'End date ($value) must be after start date';
  }
}
