import { DATE_FORMAT, matches } from './formats';
import { RequeteInvalideError } from './RequeteInvalideError';

export function parsePlanningDate(date: unknown): string {
  if (!matches(date, DATE_FORMAT)) {
    throw new RequeteInvalideError('the date query parameter must be AAAA-MM-JJ');
  }
  return date;
}
