/**
 * Tests for Screen 24: Claimant's Circumstances
 * Route: /claims/claimants-circumstances
 *
 * This screen captures optional information about the claimant's circumstances
 * that the court may consider when deciding on a possession order.
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToMoneyJudgement
} = require('../helpers/sessionHelper');

describe('Screen 24: Claimant\'s Circumstances', () => {
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

  describe('GET /claims/claimants-circumstances', () => {

    describe('AC-1: Display claimant circumstances question', () => {

      it('should display question about providing claimant circumstances', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('circumstances');
        expect(response.text).toContain('information');
      });

      it('should display Yes radio option', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="yes"/);
        expect(response.text).toContain('Yes');
      });

      it('should display No radio option', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="no"/);
        expect(response.text).toContain('No');
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/name="provideCircumstances"/);
      });

      it('should display guidance about financial or general information', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('financial');
        expect(response.text).toContain('court may consider');
      });

    });

    describe('AC-3: Conditional details field', () => {

      it('should include details textarea in conditional reveal', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/name="circumstancesDetails"/);
      });

      it('should include character count guidance', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('950 characters');
      });

    });

    describe('Pre-population on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Submit with Yes
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Test details' })
          .expect(302);

        // Revisit
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Submit with No
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        // Revisit
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-populate details text when revisiting', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Submit with details
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Financial hardship details' })
          .expect(302);

        // Revisit
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('Financial hardship details');
      });

    });

  });

  describe('POST /claims/claimants-circumstances', () => {

    describe('AC-2: Selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        // Apostrophe may be HTML-encoded as &#39;
        expect(response.text).toContain('Select whether you want to provide information about the claimant');
        expect(response.text).toContain('circumstances');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/<a href="#provideCircumstances"/);
      });

    });

    describe('AC-4: Details are optional when revealed', () => {

      it('should accept Yes with empty details', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: '' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

      it('should accept Yes with whitespace-only details', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: '   ' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

    });

    describe('AC-5: Character limit enforced', () => {

      it('should show error when details exceed 950 characters', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: longText })
          .expect(200);

        expect(response.text).toContain('Enter 950 characters or fewer');
      });

      it('should accept exactly 950 characters', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const exactText = 'a'.repeat(950);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: exactText })
          .expect(302);

        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

    });

    describe('AC-6: Persist claimant circumstances', () => {

      it('should store provided: true when Yes selected', async () => {
        await navigateToClaimantsCircumstances(testSession);

        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Some details' })
          .expect(302);

        // Verify by revisiting
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store provided: false when No selected', async () => {
        await navigateToClaimantsCircumstances(testSession);

        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        // Verify by revisiting
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should store details when Yes selected with text', async () => {
        await navigateToClaimantsCircumstances(testSession);

        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Financial difficulties' })
          .expect(302);

        // Verify by revisiting
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('Financial difficulties');
      });

      it('should clear details when changing from Yes to No', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // First submit with Yes and details
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Some details' })
          .expect(302);

        // Then change to No
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        // Verify details are cleared
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).not.toContain('Some details');
      });

    });

    describe('AC-8: Previous navigation', () => {

      it('should redirect to money-judgement when Previous clicked', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ action: 'previous' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

    });

    describe('AC-9: Continue navigation', () => {

      it('should redirect to defendants-circumstances when Continue clicked with Yes', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

      it('should redirect to defendants-circumstances when Continue clicked with No', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ action: 'cancel' })
          .expect(302);

        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-11: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('govuk-radios');
        expect(response.text).toMatch(/type="radio"/);
      });

    });

  });

});

/**
 * Helper: Navigate to Claimant's Circumstances (Screen 24)
 */
async function navigateToClaimantsCircumstances(agent) {
  await navigateToMoneyJudgement(agent);

  // Screen 23: Submit money judgement
  await agent
    .post('/claims/money-judgement')
    .send({
      moneyJudgementRequested: 'yes'
    })
    .expect(302);

  return agent;
}
