/**
 * Tests for Screen 28: Claiming Costs
 * Route: /claims/claiming-costs
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToClaimingCosts
} = require('../helpers/sessionHelper');

describe('Screen 28: Claiming Costs', () => {
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

  describe('GET /claims/claiming-costs', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('should display page heading "Claiming costs"', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toContain('Claiming costs');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display question and radio options', () => {

      it('should display question "Do you want to ask for your costs back?"', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toContain('Do you want to ask for your costs back?');
      });

      it('should display hint text about schedule of costs', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toContain('You do not need to provide the exact amount at this stage');
        expect(response.text).toContain('judge will request a schedule of costs');
      });

      it('should display Yes radio option', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/name="claimingCosts"/);
      });

    });

    describe('AC-5: Preserve selection on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/claiming-costs', () => {

    describe('AC-3: Yes/No selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select yes if you want to ask for your costs back');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#claimingCosts"/);
      });

    });

    describe('AC-4: Persist costs claim intention', () => {

      it('should store yes when Yes selected', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store no when No selected', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should update stored value when changing selection', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-6: Previous navigation', () => {

      it('should redirect to statement-of-express-terms when Previous clicked', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-express-terms');
      });

      it('should preserve data when navigating back', async () => {
        await navigateToClaimingCosts(testSession);
        await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/claiming-costs')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-7: Continue navigation', () => {

      it('should redirect to next screen when Continue with Yes', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'yes' })
          .expect(302);
        expect(response.headers.location).toBeDefined();
        expect(response.headers.location).not.toBe('/claims/claiming-costs');
      });

      it('should redirect to next screen when Continue with No', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({ claimingCosts: 'no' })
          .expect(302);
        expect(response.headers.location).toBeDefined();
        expect(response.headers.location).not.toBe('/claims/claiming-costs');
      });

    });

    describe('AC-8: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-9: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .post('/claims/claiming-costs')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have properly labelled radio inputs', async () => {
        await navigateToClaimingCosts(testSession);
        const response = await testSession
          .get('/claims/claiming-costs')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

  });

});
