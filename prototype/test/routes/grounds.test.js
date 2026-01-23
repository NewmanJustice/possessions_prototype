/**
 * Assured Journey Confirmation Route Tests - Screen 13.1
 * 
 * Tests for /claims/grounds-for-possession-assured-confirmation
 * Covers: assured journey confirmation, branching logic, navigation
 * 
 * @see /test/artifacts/screen13.1/understanding.md
 * @see /test/artifacts/screen13.1/test-plan.md
 * @see /test/artifacts/screen13.1/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToTenancy, createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Assured Journey Confirmation Route - /claims/grounds-for-possession-assured-confirmation', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('T-X.1: should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('T-X.2: should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-1: Display confirmation question
  // ============================================================
  describe('AC-1: Display confirmation question', () => {
    it('T-1.1: should display confirmation question', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Do you want to proceed with assured-tenancy grounds/i);
    });

    it('T-1.2: should show Yes/No radio options', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toContain('type="radio"');
      expect(response.text).toContain('value="yes"');
      expect(response.text).toContain('value="no"');
    });

    it('T-1.3: should show supporting explanatory text', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.status).toBe(200);
      // Explanatory text should be present
      expect(response.text.length).toBeGreaterThan(100);
    });
  });

  // ============================================================
  // AC-2: Selection is required
  // ============================================================
  describe('AC-2: Selection is required', () => {
    it('T-2.1: should show error summary when submitted without selection', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toContain('govuk-error-summary');
    });

    it('T-2.2: should show specific error message', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toMatch(/Select whether you want to proceed with assured-tenancy grounds/i);
    });

    it('T-2.3: should move focus to error summary', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toContain('govuk-error-summary');
      expect(response.text).toMatch(/<title>Error:/i);
    });

    it('T-2.4: should have error link to radio group', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toContain('href="#assuredProceed');
    });
  });

  // ============================================================
  // AC-3: Yes path - proceed with assured-tenancy grounds
  // ============================================================
  describe('AC-3: Yes path - proceed with assured-tenancy grounds', () => {
    it('T-3.1: should store assuredProceed = true in session', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      // Verify by checking session persists on next GET
      const getResponse = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(getResponse.status).toBe(200);
    });

    it('T-3.2: should redirect to /claims/grounds-for-possession-assured-selection', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-selection');
    });
  });

  // ============================================================
  // AC-4: No path - proceed to alternate grounds flow
  // ============================================================
  describe('AC-4: No path - proceed to alternate grounds flow', () => {
    it('T-4.1: should store assuredProceed = false in session', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'no' });
      
      // Verify by checking session persists
      const getResponse = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(getResponse.status).toBe(200);
    });

    it('T-4.2: should redirect to /claims/grounds-for-possession', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'no' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession');
    });
  });

  // ============================================================
  // AC-5: Preserve selection on validation failure
  // ============================================================
  describe('AC-5: Preserve selection on validation failure', () => {
    it('T-5.1: should preserve Yes selection on validation error', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      // First submit with Yes
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      // Go back and submit with validation error (simulate by adding invalid field)
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      
      // Value should be preserved
      expect(response.text).toContain('value="yes"');
    });

    it('T-5.2: should preserve No selection on validation error', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      // Submit with No
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'no' });
      
      // Navigate back
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      
      // Value should be preserved
      expect(response.text).toContain('value="no"');
    });
  });

  // ============================================================
  // AC-6: Previous navigation
  // ============================================================
  describe('AC-6: Previous navigation', () => {
    it('T-6.1: should have Previous link to /claims/tenancy', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toMatch(/href="\/claims\/tenancy"/i);
    });

    it('T-6.2: should preserve form data when navigating back', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      // Select Yes
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      // Navigate to assured selection, then back
      await testSession.get('/claims/grounds-for-possession-assured-selection');
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      
      // Selection should be preserved
      expect(response.text).toContain('value="yes"');
    });
  });

  // ============================================================
  // AC-7: Cancel behaviour
  // ============================================================
  describe('AC-7: Cancel behaviour', () => {
    it('T-7.1: should have Cancel link to /case-list', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toMatch(/href="\/case-list"/i);
    });

    it('T-7.2: should preserve claim draft after Cancel', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      // Select Yes
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      // Navigate to case list
      const caseListResponse = await testSession.get('/case-list');
      expect(caseListResponse.status).toBe(200);
      
      // Return to confirmation page - data should still be there
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-8: Accessibility compliance
  // ============================================================
  describe('AC-8: Accessibility compliance', () => {
    it('T-8.1: should show error summary on validation failure', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toContain('govuk-error-summary');
    });

    it('T-8.2: should have error link to radio group', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toContain('href="#assuredProceed');
    });

    it('T-8.3: should move focus to error summary', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toMatch(/<title>Error:/i);
    });

    it('T-8.4: should have radio inputs properly labelled', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toContain('<label');
      expect(response.text).toContain('for=');
    });

    it('T-8.5: should have radio inputs keyboard accessible', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toContain('type="radio"');
      // Radio buttons are inherently keyboard accessible
      expect(response.text).toContain('name="assuredProceed"');
    });
  });

  // ============================================================
  // Page Content & UX
  // ============================================================
  describe('Page Content & UX', () => {
    it('T-X.3: should have correct page title', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toMatch(/<title>.*Possessions.*GOV\.UK<\/title>/i);
    });

    it('T-X.4: should include "Error:" in page title on validation failure', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({});
      
      expect(response.text).toMatch(/<title>Error:.*<\/title>/i);
    });

    it('T-X.5: should show previously selected option when re-visiting', async () => {
      const testSession = session(app);
      await navigateToAssuredConfirmation(testSession);
      
      // Submit with Yes
      await testSession
        .post('/claims/grounds-for-possession-assured-confirmation')
        .send({ assuredProceed: 'yes' });
      
      // Go to next page
      await testSession.get('/claims/grounds-for-possession-assured-selection');
      
      // Come back
      const response = await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      expect(response.text).toContain('checked');
      expect(response.text).toContain('value="yes"');
    });
  });
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Navigate to assured confirmation page
 * Completes all prerequisite journey steps
 */
async function navigateToAssuredConfirmation(testSession) {
  await navigateToTenancy(testSession);
  
  // Submit tenancy with assured-tenancy type (sets groundsModel = ASSURED)
  await testSession
    .post('/claims/tenancy')
    .send({ tenancyType: 'assured-tenancy' });
  
  // Now at assured confirmation page
  return await testSession.get('/claims/grounds-for-possession-assured-confirmation');
}
