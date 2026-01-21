const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Possessions Landing Page', () => {
  describe('GET /possessions', () => {
    it('should render possessions landing page for authenticated user', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/possessions');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Possessions');
    });

    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/possessions');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should contain link to start claim', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/possessions');
      expect(response.text).toContain('Start');
      expect(response.text).toContain('/claims/start');
    });

    it('should contain sign out link', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/possessions');
      expect(response.text).toContain('Sign out');
    });
  });
});

describe('Case List Dashboard', () => {
  describe('GET /case-list', () => {
    it('should render case list for authenticated user', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/case-list');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Case list');
    });

    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/case-list');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should contain filter panel', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/case-list');
      expect(response.text).toContain('filter'); // or 'Filter'
    });

    it('should contain case table', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/case-list');
      expect(response.text).toContain('Case number');
    });

    // TODO: Add tests for filter functionality when implemented
    // TODO: Add tests for table sorting when implemented
    // TODO: Add tests for pagination when implemented
  });
});
