import request from 'supertest';
import {app,server} from '../server';

describe('Singers Service', () => {
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('should return 200 and a list of singers', async () => {
    const res = await request(app).get('/api/singers/all');

    expect(res.status).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('first_name');
    expect(res.body[0]).toHaveProperty('last_name');
    expect(res.body[0]).toHaveProperty('stage_name');
    expect(res.body[0]).toHaveProperty('photo_url');
    expect(res.body[0]).toHaveProperty('bio');
    expect(res.body[0]).toHaveProperty('birth_date');
    expect(res.body[0]).toHaveProperty('last_gala_id');
  });

  it('should return 500 for an invalid UID', async () => {
    const invalidId = 'abcd-2345-abcd'; // ID inválido
    const res = await request(app).get(`/api/singers/${invalidId}`);

    expect(res.status).toBe(500);
  });
});