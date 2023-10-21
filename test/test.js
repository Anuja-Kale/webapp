const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure

describe('GET /healthz', () => {
  it('should return 200 and an empty object when DB is connected', async () => {
    await request(app)
      .get('/healthz')
      .expect('Cache-Control', 'no-cache, no-store, must-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });

  // Additional test for 503 could be added, but it requires mocking the DB connection failure.
});
