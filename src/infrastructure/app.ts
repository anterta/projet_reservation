import express from 'express';
import { ListSalles } from '../application/ListSalles';
import { SalleRepository } from '../domaine/SalleRepository';
import { InMemorySalleRepository } from './InMemorySalleRepository';

export function createApp(salleRepository: SalleRepository = new InMemorySalleRepository()) {
  const app = express();
  const listSalles = new ListSalles(salleRepository);

  app.get('/salles', (_request, response) => {
    const salles = listSalles.execute().map(({ id, nom, capacite }) => ({ id, nom, capacite }));
    response.status(200).json(salles);
  });

  return app;
}
