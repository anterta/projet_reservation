import express, { NextFunction, Request, Response } from 'express';
import { ListSalles } from '../application/ListSalles';
import { ReserveSalle } from '../application/ReserveSalle';
import { DomainError } from '../domaine/DomainError';
import { Reservation } from '../domaine/Reservation';
import { PlanningRepository } from '../domaine/PlanningRepository';
import { SalleRepository } from '../domaine/SalleRepository';
import { InMemoryPlanningRepository } from './InMemoryPlanningRepository';
import { InMemorySalleRepository } from './InMemorySalleRepository';
import { parseReservationRequest } from './reservationRequest';
import { RequeteInvalideError } from './RequeteInvalideError';

const statusByCode: Record<string, number> = {
  CRENEAU_INVALIDE: 422,
  CAPACITE_DEPASSEE: 422,
  SALLE_INCONNUE: 404,
  CHEVAUCHEMENT: 409,
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

export function createApp(
  salleRepository: SalleRepository = new InMemorySalleRepository(),
  planningRepository: PlanningRepository = new InMemoryPlanningRepository(),
) {
  const app = express();
  app.use(express.json());

  const listSalles = new ListSalles(salleRepository);
  const reserveSalle = new ReserveSalle(salleRepository, planningRepository);

  app.get('/salles', (_request, response) => {
    const salles = listSalles.execute().map(({ id, nom, capacite }) => ({ id, nom, capacite }));
    response.status(200).json(salles);
  });

  app.post('/salles/:id/reservations', (request, response) => {
    const reservation = reserveSalle.execute({
      salleId: request.params.id,
      ...parseReservationRequest(request.body),
    });
    response.status(201).json(toReservationResponse(reservation));
  });

  app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof RequeteInvalideError) {
      response.status(400).json({ code: error.code, message: error.message });
      return;
    }
    if (error instanceof DomainError) {
      response.status(statusByCode[error.code]).json({ code: error.code, message: error.message });
      return;
    }
    next(error);
  });

  return app;
}
