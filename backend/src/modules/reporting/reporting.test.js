const request = require('supertest');
const app = require('../../../server');

let token;

describe('Reporting', () => {

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@ecoreport.com',
        password: 'test123'
      });
    token = response.body.data.token;
  });

  it('GET /api/reports returns all reports', async () => {
    const response = await request(app)
      .get('/api/reports');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/reports creates a report', async () => {
    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test waste report',
        description: 'Plastic waste near market',
        latitude: 3.8480,
        longitude: 11.5021,
        wasteType: 'plastic'
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Test waste report');
  });

  it('POST /api/reports blocked without token', async () => {
    const response = await request(app)
      .post('/api/reports')
      .send({
        title: 'Fake report',
        description: 'Should be blocked',
        latitude: 3.8480,
        longitude: 11.5021,
        wasteType: 'plastic'
      });
    expect(response.status).toBe(401);
  });

  it('GET /api/reports/mine returns user reports', async () => {
    const response = await request(app)
      .get('/api/reports/mine')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('GET /api/reports/stats returns statistics', async () => {
    const response = await request(app)
      .get('/api/reports/stats');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('total');
    expect(response.body.data).toHaveProperty('pending');
  });

});