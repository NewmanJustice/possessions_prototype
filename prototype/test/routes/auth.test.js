const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { createPartialAuthSession } = require('../helpers/sessionHelper');

describe('Authentication Routes', () => {
  describe('GET /auth/sign-in', () => {
    it('should render sign-in page', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });
      
      const response = await testSession.get('/auth/sign-in');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Sign in');
    });

    it('should contain email and password fields', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });
      
      const response = await testSession.get('/auth/sign-in');
      expect(response.text).toContain('email');
      expect(response.text).toContain('password');
    });
  });

  describe('POST /auth/sign-in', () => {
    it('should reject empty email', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });

      const postResponse = await testSession
        .post('/auth/sign-in')
        .send({ email: '', password: 'password123' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/auth/sign-in');

      const getResponse = await testSession.get('/auth/sign-in');
      expect(getResponse.text).toContain('Enter your email');
    });

    it('should reject empty password', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });

      const postResponse = await testSession
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/auth/sign-in');

      const getResponse = await testSession.get('/auth/sign-in');
      expect(getResponse.text).toContain('Enter your password');
    });

    it('should accept any valid email format (prototype mode)', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });
      
      const response = await testSession
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/auth/one-time-code');
    });
  });

  describe('GET /auth/one-time-code', () => {
    it('should render 2FA page after successful sign-in', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });
      await testSession.post('/auth/sign-in').send({
        email: 'test@example.com',
        password: 'password123'
      });
      
      const response = await testSession.get('/auth/one-time-code');
      expect(response.status).toBe(200);
      expect(response.text).toContain('security code');
    });

    it('should redirect if not partially authenticated', async () => {
      const response = await request(app).get('/auth/one-time-code');
      expect(response.status).toBe(302);
    });
  });

  describe('POST /auth/one-time-code', () => {
    it('should reject empty code', async () => {
      const testSession = session(app);
      await createPartialAuthSession(testSession);

      const postResponse = await testSession
        .post('/auth/one-time-code')
        .send({ code: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/auth/one-time-code');

      const getResponse = await testSession.get('/auth/one-time-code');
      expect(getResponse.text).toContain('Enter your security code');
    });

    it('should accept any 6-digit code (prototype mode)', async () => {
      const testSession = session(app);
      await createPartialAuthSession(testSession);
      
      const response = await testSession
        .post('/auth/one-time-code')
        .send({ code: '123456' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/case-list');
    });

    it('should create authenticated session with SOLICITOR role', async () => {
      const testSession = session(app);
      await createPartialAuthSession(testSession);
      
      await testSession
        .post('/auth/one-time-code')
        .send({ code: '123456' });
      
      // Verify can access protected route
      const response = await testSession.get('/possessions');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /auth/forgot-password', () => {
    it('should render forgot password page', async () => {
      // Forgot password doesn't require full auth, just needs access code and user type
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });

      const response = await testSession.get('/auth/forgot-password');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Forgot');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should accept email and show success message', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });

      const postResponse = await testSession
        .post('/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/auth/forgot-password');

      const getResponse = await testSession.get('/auth/forgot-password');
      expect(getResponse.text).toContain('test@example.com');
    });
  });

  describe('GET /sign-out', () => {
    it('should destroy session and redirect to access page', async () => {
      const testSession = session(app);
      await testSession.post('/access').send({ accessCode: 'letmein' });
      await testSession.post('/select-user-type').send({ userType: 'professional' });
      await testSession.post('/auth/sign-in').send({
        email: 'test@example.com',
        password: 'password123'
      });
      await testSession.post('/auth/one-time-code').send({ code: '123456' });
      
      const signOutResponse = await testSession.get('/sign-out');
      expect(signOutResponse.status).toBe(302);
      expect(signOutResponse.headers.location).toBe('/access');
      
      // Verify session is destroyed by trying to access protected route
      const protectedResponse = await testSession.get('/possessions');
      expect(protectedResponse.status).toBe(302); // Should redirect to sign-in
    });
  });
});
