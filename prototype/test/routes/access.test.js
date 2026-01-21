const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');

describe('Access Code Route', () => {
  describe('GET /access', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/access');
      expect(response.status).toBe(200);
    });

    it('should render access code page', async () => {
      const response = await request(app).get('/access');
      expect(response.text).toContain('Enter access code');
    });

    it('should not require authentication', async () => {
      const response = await request(app).get('/access');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /access', () => {
    it('should reject empty access code', async () => {
      const testSession = session(app);
      // POST with empty code - should redirect back
      const postResponse = await testSession
        .post('/access')
        .send({ accessCode: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/access');

      // Follow redirect and check for error
      const getResponse = await testSession.get('/access');
      expect(getResponse.text).toContain('Enter the access code');
    });

    it('should reject incorrect access code', async () => {
      const testSession = session(app);
      const postResponse = await testSession
        .post('/access')
        .send({ accessCode: 'wrongcode' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/access');

      const getResponse = await testSession.get('/access');
      expect(getResponse.text).toContain('not correct');
    });

    it('should accept valid access code and redirect to user type selection', async () => {
      const testSession = session(app);
      const response = await testSession
        .post('/access')
        .send({ accessCode: process.env.ACCESS_CODE || 'letmein' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/select-user-type');
    });

    it('should store access granted in session', async () => {
      const testSession = session(app);
      
      await testSession
        .post('/access')
        .send({ accessCode: process.env.ACCESS_CODE || 'letmein' });
      
      const response = await testSession.get('/select-user-type');
      expect(response.status).toBe(200); // Should not redirect back to access
    });
  });

  describe('GET / (root)', () => {
    it('should redirect to /access', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/access');
    });
  });
});
