/**
 * Tests for Screen 26b: Reasons for requesting a suspension order
 * Route: /claims/reasons-for-suspension
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToReasonsForSuspension
} = require('../helpers/sessionHelper');

describe('Screen 26b: Reasons for requesting a suspension order', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
    await createAuthenticatedSession(testSession);
  });

  afterEach(() => {
    if (testSession) {
      testSession.destroy();
    }
  });

  describe('GET /claims/reasons-for-suspension', () => {

    describe('AC-1: Display page heading and guidance', () => {

      it('should display page heading "Reasons for requesting a suspension order"', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toContain('Reasons for requesting a suspension order');
      });

      it('should display guidance about explaining reasons', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toMatch(/suspension.*order/i);
      });

      it('should mention court will use the information', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toMatch(/court/i);
      });

      it('should be accessible at /claims/reasons-for-suspension', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension');
        expect(response.status).toBe(200);
      });

    });

    describe('AC-2: Display reasons text area', () => {

      it('should display textarea with correct name attribute', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toMatch(/name="reasons"/);
      });

      it('should display textarea with correct id attribute', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toMatch(/id="reasons"/);
      });

    });

    describe('AC-6: Preserve input on revisit', () => {

      it('should have empty textarea on first visit', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).not.toContain('Previously entered text');
      });

      it('should pre-populate textarea with previously entered text', async () => {
        await navigateToReasonsForSuspension(testSession);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Tenant has breached tenancy terms repeatedly' })
          .expect(302);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toContain('Tenant has breached tenancy terms repeatedly');
      });

      it('should update pre-populated text when changed', async () => {
        await navigateToReasonsForSuspension(testSession);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Initial reasons' })
          .expect(302);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Updated reasons text' })
          .expect(302);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toContain('Updated reasons text');
      });

    });

  });

  describe('POST /claims/reasons-for-suspension', () => {

    describe('AC-3: Reasons are optional', () => {

      it('should accept empty submission without error', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: '' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should accept submission with no reasons field', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({})
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should not show validation error for empty reasons', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: '' });
        expect(response.text).not.toContain('govuk-error-summary');
      });

    });

    describe('AC-4: Character limit enforced', () => {

      it('should show error when reasons exceed 950 characters', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toContain('Enter 950 characters or fewer');
      });

      it('should display GOV.UK error summary for character limit error', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting textarea', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toMatch(/<a href="#reasons"/);
      });

      it('should accept exactly 950 characters', async () => {
        await navigateToReasonsForSuspension(testSession);
        const exactText = 'a'.repeat(950);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: exactText })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should reject 951 characters', async () => {
        await navigateToReasonsForSuspension(testSession);
        const overText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: overText })
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should preserve entered text on validation error', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toContain(longText);
      });

    });

    describe('AC-5: Persist suspension order reasons', () => {

      it('should store reasons in session when provided', async () => {
        await navigateToReasonsForSuspension(testSession);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Valid suspension reasons' })
          .expect(302);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toContain('Valid suspension reasons');
      });

      it('should handle empty reasons as null', async () => {
        await navigateToReasonsForSuspension(testSession);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Some text' })
          .expect(302);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: '' })
          .expect(302);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).not.toContain('Some text');
      });

    });

    describe('AC-7: Previous navigation', () => {

      it('should redirect to alternative-to-possession when Previous clicked', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

      it('should preserve entered data when navigating back', async () => {
        await navigateToReasonsForSuspension(testSession);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Preserved reasons' })
          .expect(302);
        await testSession
          .post('/claims/reasons-for-suspension')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toContain('Preserved reasons');
      });

      it('should not validate when Previous clicked', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ action: 'previous', reasons: longText })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-8: Continue navigation', () => {

      it('should redirect to claiming-costs with empty reasons', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: '' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should redirect to claiming-costs with valid reasons', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: 'Valid reasons for suspension order' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

    });

    describe('AC-9: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-10: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus management', async () => {
        await navigateToReasonsForSuspension(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/reasons-for-suspension')
          .send({ reasons: longText })
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have properly labelled textarea', async () => {
        await navigateToReasonsForSuspension(testSession);
        const response = await testSession
          .get('/claims/reasons-for-suspension')
          .expect(200);
        expect(response.text).toMatch(/govuk-label/);
      });

    });

  });

});
