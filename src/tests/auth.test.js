const request = require('supertest');
const app = require('../server'); // import your Express app

describe('Auth API', () => {
  // Test Case: Register new citizen
  it('should register a new citizen and return JWT token', async () => {
    const res = await request(app)
      .post('/api/register')   // endpoint
      .send({
        phone: '2348012345678',
        password: 'password123',
        name: 'John Citizen',
        role: 'citizen'
      });

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token'); // check JWT token exists
    expect(typeof res.body.token).toBe('string');
  });
});