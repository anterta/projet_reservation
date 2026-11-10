import { DomainError } from './DomainError';
import { Reservation } from './Reservation';
import { Salle } from './Salle';

export class CapaciteDepasseeError extends DomainError {
  constructor(message: string) {
    super('CAPACITE_DEPASSEE', message);
  }
}

export class ChevauchementError extends DomainError {
  constructor(message: string) {
    super('CHEVAUCHEMENT', message);
  }
}

export class PlanningSalle {
  private readonly reservations: Reservation[];

  constructor(
    readonly salle: Salle,
    readonly date: string,
    reservations: Reservation[] = [],
  ) {
    this.reservations = [...reservations];
  }

  getReservations(): Reservation[] {
    return [...this.reservations];
  }

  add(reservation: Reservation): void {
    if (reservation.participants < 1 || reservation.participants > this.salle.capacite) {
      throw new CapaciteDepasseeError(
        `participants must be between 1 and ${this.salle.capacite}`,
      );
    }
    if (this.reservations.some((existing) => existing.creneau.overlaps(reservation.creneau))) {
      throw new ChevauchementError('the creneau overlaps an existing reservation');
    }
    this.reservations.push(reservation);
  }
}
