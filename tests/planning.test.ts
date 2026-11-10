import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/app';

describe('GET /salles/:id/planning', () => {
  it('returns 200 and an empty list for a date without reservation', async () => {
    const response = await request(createApp()).get('/salles/A/planning?date=2026-12-01');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
