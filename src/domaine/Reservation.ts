export class Reservation {
  constructor(
    readonly id: string,
    readonly salleId: string,
    readonly date: string,
    readonly debut: string,
    readonly fin: string,
    readonly organisateur: string,
    readonly participants: number,
  ) {}
}
