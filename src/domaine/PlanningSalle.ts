import { DomainError } from './DomainError';
import { Reservation } from './Reservation';

export class CapaciteDepasseeError extends DomainError {
  constructor(message: string) {
    super('CAPACITE_DEPASSEE', message);
  }
}

export class PlanningSalle {
  private readonly reservations: Reservation[] = [];

  constructor(
    readonly salleId: string,
    readonly date: string,
  ) {}

  add(reservation: Reservation): void {
    if (reservation.participants < 1) {
      throw new CapaciteDepasseeError('a reservation needs at least 1 participant');
    }
    this.reservations.push(reservation);
  }
}
