import { randomUUID } from 'node:crypto';
import { Creneau } from '../domaine/Creneau';
import { PlanningRepository } from '../domaine/PlanningRepository';
import { Reservation } from '../domaine/Reservation';
import { SalleInconnueError } from '../domaine/Salle';
import { SalleRepository } from '../domaine/SalleRepository';

export interface ReserveSalleCommand {
  salleId: string;
  date: string;
  debut: string;
  fin: string;
  organisateur: string;
  participants: number;
}

export class ReserveSalle {
  constructor(
    private readonly salleRepository: SalleRepository,
    private readonly planningRepository: PlanningRepository,
  ) {}

  execute(command: ReserveSalleCommand): Reservation {
    const salle = this.salleRepository.findById(command.salleId);
    if (!salle) {
      throw new SalleInconnueError(command.salleId);
    }
    const planning = this.planningRepository.findBySalleAndDate(salle, command.date);
    const reservation = new Reservation(
      randomUUID(),
      salle.id,
      command.date,
      Creneau.create(command.debut, command.fin),
      command.organisateur,
      command.participants,
    );
    planning.add(reservation);
    this.planningRepository.save(planning);
    return reservation;
  }
}
