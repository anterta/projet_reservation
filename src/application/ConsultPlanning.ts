import { PlanningRepository } from '../domaine/PlanningRepository';
import { Reservation } from '../domaine/Reservation';
import { SalleInconnueError } from '../domaine/Salle';
import { SalleRepository } from '../domaine/SalleRepository';

export class ConsultPlanning {
  constructor(
    private readonly salleRepository: SalleRepository,
    private readonly planningRepository: PlanningRepository,
  ) {}

  execute(salleId: string, date: string): Reservation[] {
    const salle = this.salleRepository.findById(salleId);
    if (!salle) {
      throw new SalleInconnueError(salleId);
    }
    return this.planningRepository.findBySalleAndDate(salle, date).getReservations();
  }
}
