import { DomainError } from './DomainError';

export class CreneauInvalideError extends DomainError {
  constructor(message: string) {
    super('CRENEAU_INVALIDE', message);
  }
}

function toMinutes(heure: string): number {
  const [hours, minutes] = heure.split(':').map(Number);
  return hours * 60 + minutes;
}

export class Creneau {
  private constructor(
    readonly debut: string,
    readonly fin: string,
  ) {}

  static create(debut: string, fin: string): Creneau {
    if (toMinutes(debut) % 15 !== 0) {
      throw new CreneauInvalideError('debut must be on a quarter hour');
    }
    return new Creneau(debut, fin);
  }
}
