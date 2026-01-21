const request = require('supertest');
const app = require('../../src/app');

describe('Health Check Route', () => {
  describe('GET /health', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON with healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should not require authentication', async () => {
      const response = await request(app).get('/health');
      expect(response.status).not.toBe(302); // Not redirected
      expect(response.status).toBe(200);
    });
  });
});
