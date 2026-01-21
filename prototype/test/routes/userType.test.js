const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');

describe('User Type Selection Routes', () => {
  describe('GET /select-user-type', () => {
    it('should render user type selection page after access code', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      
      const response = await testSession.get('/select-user-type');
      expect(response.status).toBe(200);
      expect(response.text).toContain('user type');
    });

    it('should redirect to access if no access code provided', async () => {
      const response = await request(app).get('/select-user-type');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/access');
    });

    it('should contain professional user option', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      
      const response = await testSession.get('/select-user-type');
      expect(response.text).toContain('professional');
    });
  });

  describe('POST /select-user-type', () => {
    it('should reject empty selection', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });

      const postResponse = await testSession
        .post('/select-user-type')
        .send({ userType: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/select-user-type');

      // Follow redirect and check for error
      const getResponse = await testSession.get('/select-user-type');
      expect(getResponse.text).toContain('Select which type of user you are');
    });

    it('should accept professional user type and redirect to sign-in', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      
      const response = await testSession
        .post('/select-user-type')
        .send({ userType: 'professional' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/auth/sign-in');
    });

    it('should store user type in session', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      
      await testSession
        .post('/select-user-type')
        .send({ userType: 'professional' });
      
      // Verify session persists by accessing next step
      const response = await testSession.get('/auth/sign-in');
      expect(response.status).toBe(200);
    });
  });
});
