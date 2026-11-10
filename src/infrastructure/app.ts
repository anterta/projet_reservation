import express from 'express';
import { ListSalles } from '../application/ListSalles';
import { ReserveSalle } from '../application/ReserveSalle';
import { SalleRepository } from '../domaine/SalleRepository';
import { InMemorySalleRepository } from './InMemorySalleRepository';

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
    response.status(201).json(reservation);
  });

  return app;
}
