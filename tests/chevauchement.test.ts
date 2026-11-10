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

function postReservation(
  app: ReturnType<typeof createApp>,
  salleId: string,
  overrides: Record<string, unknown> = {},
) {
  return request(app)
    .post(`/salles/${salleId}/reservations`)
    .send({ ...validBody, ...overrides });
}

describe('Reservation overlap', () => {
  it('returns 409 CHEVAUCHEMENT when the creneau overlaps an existing reservation of the same salle and date', async () => {
    const app = createApp();
    await postReservation(app, 'A', { debut: '09:00', fin: '10:00' });

    const response = await postReservation(app, 'A', { debut: '09:30', fin: '10:30' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ code: 'CHEVAUCHEMENT', message: expect.any(String) });
  });

  it('accepts contiguous creneaux', async () => {
    const app = createApp();
    await postReservation(app, 'A', { debut: '09:00', fin: '10:00' });

    const response = await postReservation(app, 'A', { debut: '10:00', fin: '11:00' });

    expect(response.status).toBe(201);
  });

  it('accepts the same creneau in another salle', async () => {
    const app = createApp();
    await postReservation(app, 'A');

    const response = await postReservation(app, 'B');

    expect(response.status).toBe(201);
  });

  it('accepts the same creneau on another date', async () => {
    const app = createApp();
    await postReservation(app, 'A', { date: '2026-12-01' });

    const response = await postReservation(app, 'A', { date: '2026-12-02' });

    expect(response.status).toBe(201);
  });
});
