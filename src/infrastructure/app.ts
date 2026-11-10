import express, { NextFunction, Request, Response } from 'express';
import { ListSalles } from '../application/ListSalles';
import { ReserveSalle } from '../application/ReserveSalle';
import { DomainError } from '../domaine/DomainError';
import { Reservation } from '../domaine/Reservation';
import { SalleRepository } from '../domaine/SalleRepository';
import { InMemorySalleRepository } from './InMemorySalleRepository';

const statusByCode: Record<string, number> = {
  CRENEAU_INVALIDE: 422,
};

function toReservationResponse(reservation: Reservation) {
  return {
    id: reservation.id,
    salleId: reservation.salleId,
    date: reservation.date,
    debut: reservation.creneau.debut,
    fin: reservation.creneau.fin,
    organisateur: reservation.organisateur,
    participants: reservation.participants,
  };
}

export function createApp(salleRepository: SalleRepository = new InMemorySalleRepository()) {
  const app = express();
  app.use(express.json());

  const listSalles = new ListSalles(salleRepository);
  const reserveSalle = new ReserveSalle();

  app.get('/salles', (_request, response) => {
    const salles = listSalles.execute().map(({ id, nom, capacite }) => ({ id, nom, capacite }));
    response.status(200).json(salles);
  });

  app.post('/salles/:id/reservations', (request, response) => {
    const { date, debut, fin, organisateur, participants } = request.body;
    const reservation = reserveSalle.execute({
      salleId: request.params.id,
      date,
      debut,
      fin,
      organisateur,
      participants,
    });
    response.status(201).json(toReservationResponse(reservation));
  });

  app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof DomainError) {
      response.status(statusByCode[error.code]).json({ code: error.code, message: error.message });
      return;
    }
    next(error);
  });

  return app;
}
