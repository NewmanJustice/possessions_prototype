/**
 * Tests for Screen 32: Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture
 * Route: /claims/underlessee-mortgagee-forfeiture-relief
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToUnderlesseeOrMortgagee,
  navigateToUnderlesseeOrMortgageeDetails
} = require('../helpers/sessionHelper');

describe('Screen 32: Underlessee Mortgagee Forfeiture Relief', () => {
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

  /**
   * Helper to navigate to Screen 32 via the "No" path (Screen 30 → Screen 32)
   * This simulates a user who said "No" on Screen 30
   */
  async function navigateViaNoPath(agent) {
    await navigateToUnderlesseeOrMortgagee(agent);
    await agent
      .post('/claims/underlessee-or-mortgagee')
      .send({ hasUnderlesseeOrMortgagee: 'no' })
      .expect(302);
  }

  /**
   * Helper to navigate to Screen 32 via the "Yes" path (Screen 30 → Screen 31 → Screen 32)
   * This simulates a user who said "Yes" on Screen 30 and completed Screen 31
   */
  async function navigateViaYesPath(agent) {
    await navigateToUnderlesseeOrMortgageeDetails(agent);
    await agent
      .post('/claims/underlessee-or-mortgagee-details')
      .send({
        knowsName: 'no',
        knowsAddress: 'no',
        hasAdditional: 'no'
      })
      .expect(302);
  }

  describe('GET /claims/underlessee-mortgagee-forfeiture-relief', () => {

    describe('AC-1: Display page heading and caption', () => {

      it('should display page heading', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toContain('Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display question and radio options', () => {

      it('should display question text', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toContain('Is there an underlessee or mortgagee entitled to claim relief against forfeiture?');
      });

      it('should display Yes radio option', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/name="hasUnderlesseeOrMortgageeForRelief"/);
      });

    });

    describe('AC-5: Preserve selection on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/underlessee-mortgagee-forfeiture-relief', () => {

    describe('AC-3: Yes/No selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#hasUnderlesseeOrMortgageeForRelief"/);
      });

    });

    describe('AC-4: Persist selection', () => {

      it('should store yes when Yes selected', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store no when No selected', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should update stored value when changing selection', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-6: Previous navigation from Screen 31 path', () => {

      it('should redirect to underlessee-or-mortgagee-details when coming from Screen 31', async () => {
        await navigateViaYesPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/underlessee-or-mortgagee-details');
      });

      it('should preserve data when navigating back from Screen 31 path', async () => {
        await navigateViaYesPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation from Screen 30 path', () => {

      it('should redirect to underlessee-or-mortgagee when coming from Screen 30', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/underlessee-or-mortgagee');
      });

      it('should preserve data when navigating back from Screen 30 path', async () => {
        await navigateViaNoPath(testSession);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
          .expect(302);
        await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-8: Continue navigation when Yes is selected', () => {

      it('should redirect to upload-additional-document when Yes selected', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/upload-additional-document');
      });

    });

    describe('AC-9: Continue navigation when No is selected', () => {

      it('should redirect to applications when No selected', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/applications');
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-11: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .post('/claims/underlessee-mortgagee-forfeiture-relief')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have properly labelled radio inputs', async () => {
        await navigateViaNoPath(testSession);
        const response = await testSession
          .get('/claims/underlessee-mortgagee-forfeiture-relief')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

  });

});
