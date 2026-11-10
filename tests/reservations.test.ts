import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/app';

const validBody = {
  date: '2026-12-01',
  debut: '09:00',
  fin: '10:00',
  organisateur: 'marie@exemple.fr',
  participants: 3,
};

function postReservation(salleId: string, overrides: Record<string, unknown> = {}) {
  return request(createApp())
    .post(`/salles/${salleId}/reservations`)
    .send({ ...validBody, ...overrides });
}

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

  it('returns 422 CRENEAU_INVALIDE when debut is not on a quarter hour', async () => {
    const response = await postReservation('A', { debut: '09:10' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ code: 'CRENEAU_INVALIDE', message: expect.any(String) });
  });

  it('returns 422 CRENEAU_INVALIDE when fin is not on a quarter hour', async () => {
    const response = await postReservation('A', { fin: '10:05' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ code: 'CRENEAU_INVALIDE', message: expect.any(String) });
  });

  it('returns 422 CRENEAU_INVALIDE when the duration is less than 30 minutes', async () => {
    const response = await postReservation('A', { debut: '09:00', fin: '09:15' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ code: 'CRENEAU_INVALIDE', message: expect.any(String) });
  });

  it('accepts a duration of exactly 30 minutes', async () => {
    const response = await postReservation('A', { debut: '09:00', fin: '09:30' });

    expect(response.status).toBe(201);
  });

  it('returns 422 CRENEAU_INVALIDE when the duration is more than 4 hours', async () => {
    const response = await postReservation('A', { debut: '09:00', fin: '13:15' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ code: 'CRENEAU_INVALIDE', message: expect.any(String) });
  });

  it('accepts a duration of exactly 4 hours', async () => {
    const response = await postReservation('A', { debut: '09:00', fin: '13:00' });

    expect(response.status).toBe(201);
  });
});
