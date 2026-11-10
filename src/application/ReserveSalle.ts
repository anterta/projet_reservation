import { randomUUID } from 'node:crypto';
import { Creneau } from '../domaine/Creneau';
import { PlanningSalle } from '../domaine/PlanningSalle';
import { Reservation } from '../domaine/Reservation';

export interface ReserveSalleCommand {
  salleId: string;
  date: string;
  debut: string;
  fin: string;
  organisateur: string;
  participants: number;
}

export class ReserveSalle {
  execute(command: ReserveSalleCommand): Reservation {
    const planning = new PlanningSalle(command.salleId, command.date);
    const reservation = new Reservation(
      randomUUID(),
      command.salleId,
      command.date,
      Creneau.create(command.debut, command.fin),
      command.organisateur,
      command.participants,
    );
    planning.add(reservation);
    return reservation;
  }
}
