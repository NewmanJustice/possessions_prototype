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

    describe('Dynamic claimant name', () => {

      it('should include claimant reference in question text', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        // Question should include some reference to claimant (either name or fallback)
        // The text pattern is: "Is there any information you'd like to provide about [name]'s circumstances?"
        expect(response.text).toMatch(/information.*about.*('|&#39;)s circumstances/i);
      });

      it('should use fallback text when claimant name not explicitly set', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        // Should contain "claimant" reference (either as name or in the fallback "the claimant")
        expect(response.text).toMatch(/claimant/i);
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

      it('should use correct name attribute for textarea', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/name="circumstancesDetails"/);
        expect(response.text).toContain('govuk-textarea');
      });

      it('should include character count guidance', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('950 characters');
      });

    });

    describe('AC-7: Pre-population on revisit', () => {

      it('should have no pre-selection on first visit', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        // Neither radio should be checked on first visit
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

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

      it('should display inline error message on radio group', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-message');
        expect(response.text).toContain('govuk-form-group--error');
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

      it('should display error summary for character limit violation', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: longText })
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error on textarea when character limit exceeded', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: longText })
          .expect(200);

        expect(response.text).toContain('govuk-error-message');
      });

      it('should have error link targeting textarea when character limit exceeded', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: longText })
          .expect(200);

        expect(response.text).toMatch(/<a href="#circumstancesDetails"/);
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

      it('should set details to null when No selected', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Submit with No - details should not be stored
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no', circumstancesDetails: 'Should be ignored' })
          .expect(302);

        // Verify by revisiting - details should not appear
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).not.toContain('Should be ignored');
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

    describe('Selection change behaviour', () => {

      it('should allow new details entry when changing from No to Yes', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // First submit with No
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        // Then change to Yes with new details
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'New details after change' })
          .expect(302);

        // Verify new details are stored
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('New details after change');
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should preserve correct state after multiple selection changes', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Yes with details
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'First details' })
          .expect(302);

        // Change to No
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'no' })
          .expect(302);

        // Change back to Yes with new details
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Final details' })
          .expect(302);

        // Verify final state
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('Final details');
        expect(response.text).not.toContain('First details');
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-8: Previous navigation', () => {

      it('should display Previous link to money-judgement', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('href="/claims/money-judgement"');
        expect(response.text).toContain('Previous');
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

      it('should persist selection before navigation to next screen', async () => {
        await navigateToClaimantsCircumstances(testSession);

        // Submit and continue
        await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: 'Persisted details' })
          .expect(302);

        // Return to screen and verify data persisted
        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
        expect(response.text).toContain('Persisted details');
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should display Cancel link to case-list', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('href="/case-list"');
        expect(response.text).toContain('Cancel');
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

      it('should have proper labels for radio inputs', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        expect(response.text).toContain('govuk-radios__label');
        expect(response.text).toContain('govuk-label');
      });

      it('should have proper label for textarea', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const response = await testSession
          .get('/claims/claimants-circumstances')
          .expect(200);

        // Textarea should have a label element or legend associated with it
        expect(response.text).toContain('govuk-label');
        expect(response.text).toContain('govuk-textarea');
      });

      it('should preserve input values after validation error', async () => {
        await navigateToClaimantsCircumstances(testSession);

        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/claimants-circumstances')
          .send({ provideCircumstances: 'yes', circumstancesDetails: longText })
          .expect(200);

        // Yes should still be selected after error
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
        // The long text should be preserved (or at least part of it)
        expect(response.text).toContain('aaaaaa');
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

