import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { creerApp } from '../src/infrastructure/app';

describe('GET /salles', () => {
  it('renvoie 200 et les 3 salles présentes au démarrage', async () => {
    const reponse = await request(creerApp()).get('/salles');

    expect(reponse.status).toBe(200);
    expect(reponse.body).toEqual([
      { id: 'A', nom: 'Atelier', capacite: 4 },
      { id: 'B', nom: 'Bureau', capacite: 8 },
      { id: 'C', nom: 'Conférence', capacite: 20 },
    ]);
  });
});
