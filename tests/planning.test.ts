import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/app';

describe('GET /salles/:id/planning', () => {
  it('returns 200 and an empty list for a date without reservation', async () => {
    const response = await request(createApp()).get('/salles/A/planning?date=2026-12-01');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns 200 and the reservations of the date sorted by debut', async () => {
    const app = createApp();
    const reserve = (date: string, debut: string, fin: string) =>
      request(app)
        .post('/salles/A/reservations')
        .send({ date, debut, fin, organisateur: 'marie@exemple.fr', participants: 3 });
    await reserve('2026-12-01', '14:00', '15:00');
    await reserve('2026-12-01', '09:00', '10:00');
    await reserve('2026-12-02', '08:00', '09:00');

    const response = await request(app).get('/salles/A/planning?date=2026-12-01');

    expect(response.status).toBe(200);
    expect(response.body.map((reservation: { debut: string }) => reservation.debut)).toEqual([
      '09:00',
      '14:00',
    ]);
    expect(response.body[0]).toMatchObject({
      id: expect.any(String),
      date: '2026-12-01',
      debut: '09:00',
      fin: '10:00',
      organisateur: 'marie@exemple.fr',
      participants: 3,
    });
  });

  it('returns 400 REQUETE_INVALIDE when the date is missing', async () => {
    const response = await request(createApp()).get('/salles/A/planning');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ code: 'REQUETE_INVALIDE', message: expect.any(String) });
  });
});
