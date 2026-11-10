import { RequeteInvalideError } from './RequeteInvalideError';

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const HEURE_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

export interface ReservationRequest {
  date: string;
  debut: string;
  fin: string;
  organisateur: string;
  participants: number;
}

function matches(value: unknown, format: RegExp): value is string {
  return typeof value === 'string' && format.test(value);
}

export function parseReservationRequest(body: unknown): ReservationRequest {
  const { date, debut, fin, organisateur, participants } = (body ?? {}) as Record<string, unknown>;

  if (
    !matches(date, DATE_FORMAT) ||
    !matches(debut, HEURE_FORMAT) ||
    !matches(fin, HEURE_FORMAT) ||
    typeof organisateur !== 'string' ||
    organisateur === '' ||
    !Number.isInteger(participants)
  ) {
    throw new RequeteInvalideError(
      'expected { date: "AAAA-MM-JJ", debut: "HH:MM", fin: "HH:MM", organisateur, participants }',
    );
  }
  return { date, debut, fin, organisateur, participants: participants as number };
}
