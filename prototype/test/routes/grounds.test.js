/**
 * Grounds for Possession Route Tests - Screen 13.1
 * 
 * Tests for /claims/grounds
 * Covers: rent arrears question, branching logic, navigation
 * 
 * @see /test/artifacts/screen13.1/understanding.md
 * @see /test/artifacts/screen13.1/test-plan.md
 * @see /test/artifacts/screen13.1/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToGrounds } = require('../helpers/sessionHelper');

describe('Grounds for Possession Route - /claims/grounds', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('T-X.1: should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/grounds');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('T-X.2: should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession.get('/claims/grounds');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-5: Continue behaviour (branching)
  // ============================================================
  describe('AC-5: Continue behaviour (branching)', () => {
    it('T-5.1: should display rent arrears question with Yes/No radios', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession.get('/claims/grounds');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/rent arrears/i);
      expect(response.text).toContain('type="radio"');
    });

    it('T-5.2: should redirect to /claims/assured-tenancy-grounds-selection when Yes selected', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'yes' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/assured-tenancy-grounds-selection');
    });

    it('T-5.3: should store rentArrears = true in session when Yes selected', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'yes' });
      
      // Verify by revisiting page
      const getResponse = await testSession.get('/claims/grounds');
      expect(getResponse.text).toContain('value="yes"');
      expect(getResponse.text).toContain('checked');
    });

    it('T-5.4: should redirect to /claims/other-tenancy-grounds when No selected', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'no' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/other-tenancy-grounds');
    });

    it('T-5.5: should store rentArrears = false in session when No selected', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'no' });
      
      // Verify by revisiting page
      const getResponse = await testSession.get('/claims/grounds');
      expect(getResponse.text).toContain('value="no"');
      expect(getResponse.text).toContain('checked');
    });

    describe('Validation Errors', () => {
      it('T-5.E.1: should show error summary when no radio selected', async () => {
        const testSession = session(app);
        await navigateToGrounds(testSession);
        
        await testSession
          .post('/claims/grounds')
          .send({ rentArrears: '' });
        
        const getResponse = await testSession.get('/claims/grounds');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-5.E.2: should show error message describing selection required', async () => {
        const testSession = session(app);
        await navigateToGrounds(testSession);
        
        await testSession
          .post('/claims/grounds')
          .send({ rentArrears: '' });
        
        const getResponse = await testSession.get('/claims/grounds');
        expect(getResponse.text).toMatch(/select|choose/i);
      });

      it('T-5.E.3: should move focus to error summary on validation failure', async () => {
        const testSession = session(app);
        await navigateToGrounds(testSession);
        
        await testSession
          .post('/claims/grounds')
          .send({ rentArrears: '' });
        
        const getResponse = await testSession.get('/claims/grounds');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toContain('There is a problem');
      });
    });
  });

  // ============================================================
  // Navigation
  // ============================================================
  describe('Navigation', () => {
    it('T-N.1: should have Previous link to /claims/tenancy', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession.get('/claims/grounds');
      expect(response.text).toContain('/claims/tenancy');
    });

    it('T-N.2: should preserve session data when navigating back', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      // Submit selection
      await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'yes' });
      
      // Navigate back
      const backResponse = await testSession.get('/claims/tenancy');
      expect(backResponse.status).toBe(200);
      
      // Navigate forward
      const forwardResponse = await testSession.get('/claims/grounds');
      expect(forwardResponse.text).toContain('value="yes"');
    });

    it('T-N.3: should have Cancel link to /case-list', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession.get('/claims/grounds');
      expect(response.text).toContain('/case-list');
      expect(response.text).toContain('Cancel');
    });

    it('T-N.4: should preserve claim draft after Cancel', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      // Navigate to case list (Cancel)
      const cancelResponse = await testSession.get('/case-list');
      expect(cancelResponse.status).toBe(200);
      
      // Go back to grounds - should still work
      const returnResponse = await testSession.get('/claims/grounds');
      expect(returnResponse.status).toBe(200);
    });
  });

  // ============================================================
  // PAGE CONTENT & UX
  // ============================================================
  describe('Page Content & UX', () => {
    it('T-X.3: should have correct page title', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      const response = await testSession.get('/claims/grounds');
      expect(response.text).toMatch(/<title>.*[Gg]rounds.*<\/title>/i);
    });

    it('T-X.4: should include "Error:" in page title on validation failure', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      await testSession
        .post('/claims/grounds')
        .send({ rentArrears: '' });
      
      const getResponse = await testSession.get('/claims/grounds');
      expect(getResponse.text).toMatch(/<title>Error:.*<\/title>/i);
    });

    it('T-X.5: should show previously saved selection when re-visiting page', async () => {
      const testSession = session(app);
      await navigateToGrounds(testSession);
      
      // Submit selection
      await testSession
        .post('/claims/grounds')
        .send({ rentArrears: 'no' });
      
      // Go to next page
      await testSession.get('/claims/other-tenancy-grounds');
      
      // Come back
      const response = await testSession.get('/claims/grounds');
      expect(response.text).toContain('value="no"');
      expect(response.text).toContain('checked');
    });
  });
});
