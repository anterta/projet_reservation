import { DomainError } from './DomainError';

export class CreneauInvalideError extends DomainError {
  constructor(message: string) {
    super('CRENEAU_INVALIDE', message);
  }
}

const MIN_DURATION_IN_MINUTES = 30;
const MAX_DURATION_IN_MINUTES = 4 * 60;
const OPENING_IN_MINUTES = 8 * 60;

function toMinutes(heure: string): number {
  const [hours, minutes] = heure.split(':').map(Number);
  return hours * 60 + minutes;
}

function isOnQuarterHour(minutes: number): boolean {
  return minutes % 15 === 0;
}

export class Creneau {
  private constructor(
    readonly debut: string,
    readonly fin: string,
  ) {}

  static create(debut: string, fin: string): Creneau {
    const debutInMinutes = toMinutes(debut);
    const finInMinutes = toMinutes(fin);

    if (!isOnQuarterHour(debutInMinutes) || !isOnQuarterHour(finInMinutes)) {
      throw new CreneauInvalideError('debut and fin must be on a quarter hour');
    }
    const duration = finInMinutes - debutInMinutes;
    if (duration < MIN_DURATION_IN_MINUTES || duration > MAX_DURATION_IN_MINUTES) {
      throw new CreneauInvalideError('a creneau must last between 30 minutes and 4 hours');
    }
    if (debutInMinutes < OPENING_IN_MINUTES) {
      throw new CreneauInvalideError('a creneau must start at 08:00 or later');
    }
    return new Creneau(debut, fin);
  }
}
