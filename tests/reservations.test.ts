import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/app';

describe('POST /salles/:id/reservations', () => {
  it('returns 201 and the reservation with its id for a valid request', async () => {
    const body = {
      date: '2026-12-01',
      debut: '09:00',
      fin: '10:00',
      organisateur: 'marie@exemple.fr',
      participants: 3,
    };

    const response = await request(createApp()).post('/salles/A/reservations').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(body);
    expect(response.body.id).toEqual(expect.any(String));
  });
});
