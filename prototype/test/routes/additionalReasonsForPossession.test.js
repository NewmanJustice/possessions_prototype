/**
 * Tests for Screen 29: Additional Reasons for Possession
 * Route: /claims/additional-reasons-for-possession
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToAdditionalReasonsForPossession
} = require('../helpers/sessionHelper');

describe('Screen 29: Additional Reasons for Possession', () => {
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

  describe('GET /claims/additional-reasons-for-possession', () => {

    describe('AC-1: Display page heading and caption', () => {

      it('should display page heading "Additional reasons for possession"', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Additional reasons for possession');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

    });

    describe('AC-2: Display radio options', () => {

      it('should display Yes radio option', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/name="hasAdditionalReasons"/);
      });

    });

    describe('AC-3: Display conditional textarea', () => {

      it('should include textarea field with correct name', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/name="additionalReasonsText"/);
      });

    });

    describe('AC-4: Preserve previous selection', () => {

      it('should have no pre-selection on first visit', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-select Yes when previously selected', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Test reasons' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-populate text when revisiting', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Previous reasons text' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Previous reasons text');
      });

    });

  });

  describe('POST /claims/additional-reasons-for-possession', () => {

    describe('AC-5: Selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select yes if you have additional reasons for possession');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#hasAdditionalReasons"/);
      });

    });

    describe('AC-6: Persist selection to session', () => {

      it('should store yes when Yes selected', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Reasons' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store no when No selected', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should store text when Yes selected with text', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Detailed reasons for possession' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Detailed reasons for possession');
      });

      it('should update stored value when changing selection', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Initial text' })
          .expect(302);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation', () => {

      it('should redirect to claiming-costs when Previous clicked', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should preserve data when navigating back', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Preserved text' })
          .expect(302);
        await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/additional-reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
        expect(response.text).toContain('Preserved text');
      });

    });

    describe('AC-8: Continue navigation', () => {

      it('should redirect to check-answers when Continue with Yes', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'yes', additionalReasonsText: 'Reasons text' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/check-answers');
      });

      it('should redirect to check-answers when Continue with No', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ hasAdditionalReasons: 'no' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/check-answers');
      });

    });

    describe('AC-9: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToAdditionalReasonsForPossession(testSession);
        const response = await testSession
          .post('/claims/additional-reasons-for-possession')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

  });

});
