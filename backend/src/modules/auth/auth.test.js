const request = require('supertest');
const app = require('../../../server');

const testEmail = `test${Date.now()}@ecoreport.com`;

describe('Authentication', () => {

  it('POST /api/auth/register creates a user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: testEmail,
        password: 'test123',
        role: 'citizen'
      });
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('token');
  });

  it('POST /api/auth/login returns token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'test123'
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  it('POST /api/auth/login fails with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword'
      });
    expect(response.status).toBe(401);
  });

});