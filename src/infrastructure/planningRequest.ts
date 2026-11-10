import { RequeteInvalideError } from './RequeteInvalideError';

export function parsePlanningDate(date: unknown): string {
  if (typeof date !== 'string') {
    throw new RequeteInvalideError('the date query parameter is required');
  }
  return date;
}
