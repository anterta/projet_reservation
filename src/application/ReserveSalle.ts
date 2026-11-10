import { randomUUID } from 'node:crypto';
import { Creneau } from '../domaine/Creneau';
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
    return new Reservation(
      randomUUID(),
      command.salleId,
      command.date,
      Creneau.create(command.debut, command.fin),
      command.organisateur,
      command.participants,
    );
  }
}
