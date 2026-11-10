export const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
export const HEURE_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

export function matches(value: unknown, format: RegExp): value is string {
  return typeof value === 'string' && format.test(value);
}
