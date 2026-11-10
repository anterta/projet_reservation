import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/app';

describe('GET /salles', () => {
  it('returns 200 and the 3 salles available at startup', async () => {
    const response = await request(createApp()).get('/salles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 'A', nom: 'Atelier', capacite: 4 },
      { id: 'B', nom: 'Bureau', capacite: 8 },
      { id: 'C', nom: 'Conférence', capacite: 20 },
    ]);
  });
});
