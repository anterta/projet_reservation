import { Creneau } from './Creneau';

export class Reservation {
  constructor(
    readonly id: string,
    readonly salleId: string,
    readonly date: string,
    readonly creneau: Creneau,
    readonly organisateur: string,
    readonly participants: number,
  ) {}
}
