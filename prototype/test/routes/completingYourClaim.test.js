/**
 * Tests for Screen 36: Completing Your Claim
 * Route: /claims/completing-your-claim
 *
 * Tests derived from user story: businessArtifacts/userstories/screen36.txt
 * Test artifacts: prototype/test/artifacts/screen36/
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToLanguageUsed
} = require('../helpers/sessionHelper');

describe('Screen 36: Completing Your Claim', () => {
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
   * Helper to navigate to Screen 36 via Screen 35
   */
  async function navigateToCompletingYourClaim(agent) {
    await navigateToLanguageUsed(agent);

    // Screen 35: Submit language selection
    await agent
      .post('/claims/language-used')
      .send({ language: 'english' })
      .expect(302);

    return agent;
  }

  describe('GET /claims/completing-your-claim', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('T-1.1: should display page heading "Completing your claim"', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('Completing your claim');
      });

      it('T-1.2: should display caption "Make a claim"', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('T-1.3: should display case number', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display explanatory text', () => {

      it('T-2.1: should display introductory text about options', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('There are two options for what do to next:');
      });

      it('T-2.2: should display bullet point about submit and pay now option', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('sign the statement of truth');
        expect(response.text).toContain('submit and pay for your claim now');
      });

      it('T-2.3: should display bullet point about save as draft option', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('save your claim as a draft');
        expect(response.text).toContain('return later');
      });

    });

    describe('AC-3: Display question with radio options', () => {

      it('T-3.1: should display question "What would you like to do next?"', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('What would you like to do next?');
      });

      it('T-3.2: should display "Submit and pay for my claim now" radio option with correct value', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('Submit and pay for my claim now');
        expect(response.text).toMatch(/value="submit-now"/);
      });

      it('T-3.3: should display "Save it for later" radio option with correct value', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toContain('Save it for later');
        expect(response.text).toMatch(/value="save-for-later"/);
      });

      it('T-3.4: should use correct name attribute for radio buttons', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/name="completionPreference"/);
      });

      it('T-3.5: should have no option pre-selected on first visit', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).not.toMatch(/value="submit-now"[^>]*checked/);
        expect(response.text).not.toMatch(/value="save-for-later"[^>]*checked/);
      });

    });

    describe('AC-6: Preserve selection on revisit', () => {

      it('T-6.1: should pre-select "Submit and pay for my claim now" when previously selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'submit-now' })
          .expect(302);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/value="submit-now"[^>]*checked/);
      });

      it('T-6.2: should pre-select "Save it for later" when previously selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'save-for-later' })
          .expect(302);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/value="save-for-later"[^>]*checked/);
      });

      it('T-6.3: should have no pre-selection on first visit', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).not.toMatch(/value="submit-now"[^>]*checked/);
        expect(response.text).not.toMatch(/value="save-for-later"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/completing-your-claim', () => {

    describe('AC-4: Selection is required (Validation)', () => {

      it('T-4.1: should show error when no selection made', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select what you would like to do next');
      });

      it('T-4.2: should display GOV.UK error summary', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('T-4.3: should have error link targeting radio group', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#completionPreference"/);
      });

    });

    describe('AC-5: Persist completion preference', () => {

      it('T-5.1: should store "submit-now" when "Submit and pay for my claim now" selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'submit-now' })
          .expect(302);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/value="submit-now"[^>]*checked/);
      });

      it('T-5.2: should store "save-for-later" when "Save it for later" selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'save-for-later' })
          .expect(302);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/value="save-for-later"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation', () => {

      it('T-7.1: should redirect to /claims/language-used when Previous clicked', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/language-used');
      });

    });

    describe('AC-8: Continue navigation', () => {

      it('T-8.1: should redirect to /claims/statement-of-truth when "submit-now" selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'submit-now' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-truth');
      });

      it('T-8.2: should redirect to /claims/statement-of-truth when "save-for-later" selected', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({ completionPreference: 'save-for-later' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-truth');
      });

    });

    describe('AC-9: Cancel behaviour', () => {

      it('T-9.1: should redirect to /case-list when Cancel clicked', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-10: Accessibility compliance', () => {

      it('T-10.1: should display GOV.UK error summary on validation failure', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('T-10.2: should have error summary with tabindex for focus', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('T-10.3: should have properly labelled radio inputs', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .get('/claims/completing-your-claim')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

    describe('AC-11: Page title reflects error state', () => {

      it('T-11.1: should prefix page title with "Error:" on validation failure', async () => {
        await navigateToCompletingYourClaim(testSession);
        const response = await testSession
          .post('/claims/completing-your-claim')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<title>Error:/);
      });

    });

  });

});
