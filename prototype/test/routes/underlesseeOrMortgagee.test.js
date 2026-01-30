/**
 * Tests for Screen 30: Underlessee or Mortgagee Entitled to Claim Relief Against Forfeiture
 * Route: /claims/underlessee-or-mortgagee
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToUnderlesseeOrMortgagee
} = require('../helpers/sessionHelper');

describe('Screen 30: Underlessee or Mortgagee', () => {
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

  describe('GET /claims/underlessee-or-mortgagee', () => {

    describe('AC-1: Display page heading and explanatory text', () => {

      it('should display page heading "Underlessee or mortgagee entitled to claim relief against forfeiture"', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toContain('Underlessee or mortgagee entitled to claim relief against forfeiture');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

      it('should display explanatory text about underlessees and mortgagees', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toContain('You must tell us if there is an underlessee');
        expect(response.text).toContain('subtenant');
        expect(response.text).toContain('mortgagee');
        expect(response.text).toContain('mortgage lender');
      });

    });

    describe('AC-2: Display question and radio options', () => {

      it('should display question "Is there an underlessee or mortgagee entitled to claim relief against forfeiture?"', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toContain('Is there an underlessee or mortgagee entitled to claim relief against forfeiture?');
      });

      it('should display Yes radio option', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/name="hasUnderlesseeOrMortgagee"/);
      });

    });

    describe('AC-5: Preserve selection on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/underlessee-or-mortgagee', () => {

    describe('AC-3: Yes/No selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#hasUnderlesseeOrMortgagee"/);
      });

    });

    describe('AC-4: Persist selection', () => {

      it('should store yes when Yes selected', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store no when No selected', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should update stored value when changing selection', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-6: Previous navigation', () => {

      it('should redirect to additional-reasons-for-possession when Previous clicked', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/additional-reasons-for-possession');
      });

      it('should preserve data when navigating back', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-7: Continue navigation', () => {

      it('should redirect to next screen when Continue with Yes', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'yes' })
          .expect(302);
        expect(response.headers.location).toBeDefined();
        expect(response.headers.location).not.toBe('/claims/underlessee-or-mortgagee');
      });

      it('should redirect to next screen when Continue with No', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ hasUnderlesseeOrMortgagee: 'no' })
          .expect(302);
        expect(response.headers.location).toBeDefined();
        expect(response.headers.location).not.toBe('/claims/underlessee-or-mortgagee');
      });

    });

    describe('AC-8: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-9: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have properly labelled radio inputs', async () => {
        await navigateToUnderlesseeOrMortgagee(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

  });

});
