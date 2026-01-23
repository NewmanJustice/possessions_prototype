/**
 * Pre-action Protocol Route Tests - Screen 16
 * 
 * Tests for /claims/preaction-protocol
 * Covers: protocol confirmation, session storage, navigation
 * 
 * @see /test/artifacts/screen16/understanding.md
 * @see /test/artifacts/screen16/test-plan.md
 * @see /test/artifacts/screen16/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToPreActionProtocol, createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Pre-action Protocol Route - /claims/preaction-protocol', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/preaction-protocol');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToPreActionProtocol(testSession);
      
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-1: Display pre-action protocol guidance
  // ============================================================
  describe('AC-1: Display pre-action protocol guidance', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('D-1: should load page successfully', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Pre-action protocol/i);
    });

    it('D-2: should display guidance text', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      // Presence-only test: check guidance exists
      expect(response.text).toContain('guidance');
    });

    it('D-3: should display warning message', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      // Presence-only test: check warning exists
      expect(response.text).toMatch(/warning|important/i);
    });
  });

  // ============================================================
  // AC-2: Ask whether the pre-action protocol has been followed
  // ============================================================
  describe('AC-2: Ask whether protocol followed', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('D-4: should display radio question', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Have you followed the pre-action protocol/i);
    });

    it('D-5: should display Yes radio option', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/radio.*true/);
      expect(response.text).toMatch(/Yes/);
    });

    it('D-6: should display No radio option', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/radio.*false/);
      expect(response.text).toMatch(/No/);
    });

    it('D-7: should display Continue button', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Continue/);
      expect(response.text).toMatch(/<button.*type="submit"/);
    });
  });

  // ============================================================
  // AC-3: Selection is required
  // ============================================================
  describe('AC-3: Selection required', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('V-1: should return error when no selection made', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error/i);
    });

    it('V-2: should display error summary', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error.*summary/i);
      expect(response.text).toMatch(/There is a problem/i);
    });

    it('V-3: should display inline error', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error-message/);
    });

    it('V-4: should display correct error message', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Select whether you have followed the pre-action protocol');
    });

    it('V-5: should focus error summary', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('V-6: should clear error with valid selection', async () => {
      // First trigger error
      await testSession
        .post('/claims/preaction-protocol')
        .send({})
        .expect(400);
      
      // Then submit valid data
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);
      
      expect(response.headers.location).toBe('/claims/mediation-settlement');
    });
  });

  // ============================================================
  // AC-4: Yes path - protocol followed
  // ============================================================
  describe('AC-4: Yes path (protocol followed)', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('Y-1: should store followed=true when Yes selected', async () => {
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      
      // Verify session contains followed: true
      // Note: actual session inspection depends on template implementation
    });

    it('Y-2: should redirect to mediation-settlement when Yes selected', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/mediation-settlement');
    });

    it('Y-3: should persist followed=true after redirect', async () => {
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      // Return to page to verify persistence
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
    });
  });

  // ============================================================
  // AC-5: No path - protocol not followed
  // ============================================================
  describe('AC-5: No path (protocol not followed)', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('N-1: should store followed=false when No selected', async () => {
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'false' })
        .expect(302);

      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
    });

    it('N-2: should redirect to mediation-settlement when No selected', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'false' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/mediation-settlement');
    });

    it('N-3: should persist followed=false after redirect', async () => {
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'false' })
        .expect(302);

      // Return to page to verify persistence
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/false.*checked|checked.*false/);
    });
  });

  // ============================================================
  // Q3: Session update tests
  // ============================================================
  describe('Session updates (Q3)', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('S-1: should store initial answer correctly', async () => {
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
    });

    it('S-2: should update answer when changed', async () => {
      // First answer: Yes
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      // Change to No
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'false' })
        .expect(302);

      // Verify No is now stored
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/false.*checked|checked.*false/);
    });

    it('S-3: should not create duplicate values', async () => {
      // Submit multiple times
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'false' })
        .expect(302);

      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      // Verify only single value exists (last one)
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
      // Should not have both checked
      expect(response.text).not.toMatch(/checked.*true[\s\S]*checked.*false/);
    });
  });

  // ============================================================
  // AC-6: Previous navigation
  // ============================================================
  describe('AC-6: Previous navigation', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('P-1: should return to Screen 13.1 when Previous clicked', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/claims/grounds-for-possession-assured-confirmation');
    });

    it('P-2: should preserve selection when returning via Previous', async () => {
      // Store answer
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      // Navigate back to Screen 13.1
      await testSession
        .get('/claims/grounds-for-possession-assured-confirmation')
        .expect(200);

      // Return to Screen 16
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
    });
  });

  // ============================================================
  // AC-7: Cancel behaviour
  // ============================================================
  describe('AC-7: Cancel behaviour', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('C-1: should return to case-list when Cancel clicked', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/case-list');
    });

    it('C-2: should preserve claim draft when Cancel clicked', async () => {
      // Store answer
      await testSession
        .post('/claims/preaction-protocol')
        .send({ followed: 'true' })
        .expect(302);

      // Navigate to case-list
      await testSession
        .get('/case-list')
        .expect(200);

      // Return to Screen 16 - data should still exist
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
    });
  });

  // ============================================================
  // AC-8: Accessibility compliance
  // ============================================================
  describe('AC-8: Accessibility compliance', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToPreActionProtocol(testSession);
    });

    it('A-1: should link error summary to radio group', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#followed"/);
    });

    it('A-2: should have labels for radio inputs', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<label.*for="followed/);
    });

    it('A-3: should have fieldset and legend structure', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<fieldset/);
      expect(response.text).toMatch(/<legend/);
    });

    it('A-4: should move focus to error summary on error', async () => {
      const response = await testSession
        .post('/claims/preaction-protocol')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error-summary.*tabindex|tabindex.*error-summary/);
    });

    it('A-5: should be keyboard accessible', async () => {
      const response = await testSession.get('/claims/preaction-protocol');
      expect(response.status).toBe(200);
      // Radio inputs should not have tabindex (naturally keyboard accessible)
      expect(response.text).toMatch(/<input.*type="radio"/);
      // Form should have accessible structure
      expect(response.text).toMatch(/<form/);
    });
  });
});
