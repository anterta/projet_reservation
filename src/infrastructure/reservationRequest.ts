import { DATE_FORMAT, HEURE_FORMAT, matches } from './formats';
import { RequeteInvalideError } from './RequeteInvalideError';

export interface ReservationRequest {
  date: string;
  debut: string;
  fin: string;
  organisateur: string;
  participants: number;
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
