import { randomUUID } from 'node:crypto';
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
      command.debut,
      command.fin,
      command.organisateur,
      command.participants,
    );
  }
}
