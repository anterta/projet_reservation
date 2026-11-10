import { RequeteInvalideError } from './RequeteInvalideError';

const REQUIRED_FIELDS = ['date', 'debut', 'fin', 'organisateur', 'participants'] as const;

export interface ReservationRequest {
  date: string;
  debut: string;
  fin: string;
  organisateur: string;
  participants: number;
}

export function parseReservationRequest(body: Record<string, unknown>): ReservationRequest {
  const missing = REQUIRED_FIELDS.filter((field) => body?.[field] === undefined);
  if (missing.length > 0) {
    throw new RequeteInvalideError(`missing fields: ${missing.join(', ')}`);
  }
  const { date, debut, fin, organisateur, participants } = body as unknown as ReservationRequest;
  return { date, debut, fin, organisateur, participants };
}
