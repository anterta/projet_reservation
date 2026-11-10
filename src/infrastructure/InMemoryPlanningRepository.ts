import { PlanningRepository } from '../domaine/PlanningRepository';
import { PlanningSalle } from '../domaine/PlanningSalle';
import { Reservation } from '../domaine/Reservation';
import { Salle } from '../domaine/Salle';

export class InMemoryPlanningRepository implements PlanningRepository {
  private readonly reservationsByKey = new Map<string, Reservation[]>();

  findBySalleAndDate(salle: Salle, date: string): PlanningSalle {
    return new PlanningSalle(salle, date, this.reservationsByKey.get(this.key(salle.id, date)));
  }

  save(planning: PlanningSalle): void {
    this.reservationsByKey.set(this.key(planning.salle.id, planning.date), planning.getReservations());
  }

  private key(salleId: string, date: string): string {
    return `${salleId}|${date}`;
  }
}
