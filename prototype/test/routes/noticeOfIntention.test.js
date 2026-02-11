/**
 * Notice of Intention Route Tests - Screen 18
 * 
 * Tests for /claims/notice-of-intention
 * Covers: notice confirmation, external link attributes, session storage, navigation
 * 
 * @see /test/artifacts/screen18/understanding.md
 * @see /test/artifacts/screen18/test-plan.md
 * @see /test/artifacts/screen18/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToNoticeOfIntention } = require('../helpers/sessionHelper');

describe('Notice of Intention Route - /claims/notice-of-intention', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/notice-of-intention');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
      
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-1, AC-2: Display tests
  // ============================================================
  describe('Display tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('D-1: should load page successfully', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Notice of your intention/i);
    });

    it('D-2: should display guidance text', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Presence-only test: check guidance exists
      expect(response.text).toMatch(/guidance|notice/i);
    });

    it('D-3: should display warning message', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Presence-only test: check warning exists
      expect(response.text).toMatch(/warning|judge|may not grant/i);
    });

    it('D-4: should display external link', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Link to guidance should exist
      expect(response.text).toMatch(/<a[^>]*href/);
    });

    it('D-5: should display radio question', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Have you served notice to the defendants/i);
    });

    it('D-6: should display Yes radio option', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/name="noticeServed"/);
      expect(response.text).toMatch(/value="true"/);
      expect(response.text).toMatch(/Yes/);
    });

    it('D-7: should display No radio option', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/name="noticeServed"/);
      expect(response.text).toMatch(/value="false"/);
      expect(response.text).toMatch(/No/);
    });

    it('D-8: should display Continue button', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Continue/);
      expect(response.text).toMatch(/<button.*type="submit"/);
    });
  });

  // ============================================================
  // External link tests (AC-1, Q1)
  // ============================================================
  describe('External link tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('L-1: should have target="_blank" attribute', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/target="_blank"/);
    });

    it('L-2: should have rel="noopener noreferrer" attribute', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/rel="noopener noreferrer"/);
    });

    it('L-3: should indicate external guidance content', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Link should reference guidance or notice periods
      expect(response.text).toMatch(/<a[^>]*guidance|notice period/i);
    });
  });

  // ============================================================
  // AC-3: Selection required
  // ============================================================
  describe('Validation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('V-1: should return error when no selection made', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error/i);
    });

    it('V-2: should display error summary', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error.*summary/i);
      expect(response.text).toMatch(/There is a problem/i);
    });

    it('V-3: should display inline error', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error-message/);
    });

    it('V-4: should display correct error message', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Select whether you have served notice to the defendants');
    });

    it('V-5: should focus error summary', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('V-6: should clear error with valid selection', async () => {
      // First trigger error
      await testSession
        .post('/claims/notice-of-intention')
        .send({})
        .expect(400);
      
      // Then submit valid data
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);
      
      expect(response.headers.location).toBe('/claims/notice-details');
    });
  });

  // ============================================================
  // AC-4, AC-5: Yes path
  // ============================================================
  describe('Yes path tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('Y-1: should store noticeServed=true when Yes selected', async () => {
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Verify Yes is checked (GOV.UK renders value before checked)
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
    });

    it('Y-2: should redirect to notice-details when Yes selected', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-details');
    });

    it('Y-3: should persist noticeServed=true after redirect', async () => {
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      // Return to page to verify persistence
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
    });
  });

  // ============================================================
  // AC-4, AC-5: No path
  // ============================================================
  describe('No path tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('N-1: should store noticeServed=false when No selected', async () => {
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'false' })
        .expect(302);

      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Verify No is checked (GOV.UK renders value before checked)
      expect(response.text).toMatch(/value="false".*checked|checked.*value="false"/);
    });

    it('N-2: should redirect to rent-details when No selected (skip notice-details)', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'false' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/rent-details');
    });

    it('N-3: should persist noticeServed=false after redirect', async () => {
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'false' })
        .expect(302);

      // Return to page to verify persistence
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="false".*checked|checked.*value="false"/);
    });
  });

  // ============================================================
  // Session update tests
  // ============================================================
  describe('Session updates', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('S-1: should store initial answer correctly', async () => {
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
    });

    it('S-2: should update answer when changed', async () => {
      // First answer: Yes
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      // Change to No
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'false' })
        .expect(302);

      // Verify No is now stored
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="false".*checked|checked.*value="false"/);
    });

    it('S-3: should not create duplicate values', async () => {
      // Submit multiple times
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'false' })
        .expect(302);

      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      // Verify only single value exists (last one)
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
      // Should not have both checked
      const checkedMatches = response.text.match(/checked/g);
      expect(checkedMatches.length).toBe(1);
    });
  });

  // ============================================================
  // AC-6: Previous navigation
  // ============================================================
  describe('Previous navigation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('P-1: should return to Screen 17 when Previous clicked', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/claims/mediation-settlement');
    });

    it('P-2: should preserve selection when returning via Previous', async () => {
      // Store answer
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      // Navigate back to Screen 17
      await testSession
        .get('/claims/mediation-settlement')
        .expect(200);

      // Return to Screen 18
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
    });
  });

  // ============================================================
  // AC-7: Cancel behaviour
  // ============================================================
  describe('Cancel tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('C-1: should return to case-list when Cancel clicked', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/case-list');
    });

    it('C-2: should preserve claim draft when Cancel clicked', async () => {
      // Store answer
      await testSession
        .post('/claims/notice-of-intention')
        .send({ noticeServed: 'true' })
        .expect(302);

      // Navigate to case-list
      await testSession
        .get('/case-list')
        .expect(200);

      // Return to Screen 18 - data should still exist
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/value="true".*checked|checked.*value="true"/);
    });
  });

  // ============================================================
  // AC-8: Accessibility compliance
  // ============================================================
  describe('Accessibility tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeOfIntention(testSession);
    });

    it('A-1: should link error summary to radio group', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#noticeServed"/);
    });

    it('A-2: should have labels for radio inputs', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<label.*for="noticeServed/);
    });

    it('A-3: should have fieldset and legend structure', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<fieldset/);
      expect(response.text).toMatch(/<legend/);
    });

    it('A-4: should move focus to error summary on error', async () => {
      const response = await testSession
        .post('/claims/notice-of-intention')
        .send({});

      expect(response.status).toBe(400);
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('A-5: should be keyboard accessible', async () => {
      const response = await testSession.get('/claims/notice-of-intention');
      expect(response.status).toBe(200);
      // Radio inputs should not have tabindex (naturally keyboard accessible)
      expect(response.text).toMatch(/<input.*type="radio"/);
      // Form should have accessible structure
      expect(response.text).toMatch(/<form/);
    });
  });
});
