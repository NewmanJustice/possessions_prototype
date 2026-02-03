/**
 * Tests for Screen 37: Statement of Truth
 * Route: /claims/statement-of-truth
 *
 * Tests derived from user story: businessArtifacts/userstories/screen37.txt
 * Test artifacts: prototype/test/artifacts/screen37/
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToCompletingYourClaim
} = require('../helpers/sessionHelper');

describe('Screen 37: Statement of Truth', () => {
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
   * Helper to navigate to Screen 37 via Screen 36
   */
  async function navigateToStatementOfTruth(agent) {
    await navigateToCompletingYourClaim(agent);

    // Screen 36: Submit completion preference
    await agent
      .post('/claims/completing-your-claim')
      .send({ completionPreference: 'submit-now' })
      .expect(302);

    return agent;
  }

  describe('GET /claims/statement-of-truth', () => {

    describe('AC-1: Display page heading and case number', () => {

      it('T-1.1: should display page heading "Statement of truth"', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('Statement of truth');
      });

      it('T-1.2: should display case number', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display statement of truth text', () => {

      it('T-2.1: should display statement text about contempt of court proceedings', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('proceedings for contempt of court');
      });

      it('T-2.2: should display full statement text including key legal phrases', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('false statement');
        expect(response.text).toContain('statement of truth');
        expect(response.text).toContain('honest belief');
      });

    });

    describe('AC-3: Display question with radio options', () => {

      it('T-3.1: should display question legend "Completed by"', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('Completed by');
      });

      it('T-3.2: should display "Claimant" radio option with correct value', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('Claimant');
        expect(response.text).toMatch(/value="claimant"/);
      });

      it('T-3.3: should display "Claimant\'s legal representative" radio option with correct value', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toContain('legal representative');
        expect(response.text).toContain('CPR 2.3 (1)');
        expect(response.text).toMatch(/value="legal-representative"/);
      });

      it('T-3.4: should use correct name attribute for radio buttons', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/name="completedBy"/);
      });

      it('T-3.5: should have no option pre-selected on first visit', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).not.toMatch(/value="claimant"[^>]*checked/);
        expect(response.text).not.toMatch(/value="legal-representative"[^>]*checked/);
      });

    });

    describe('AC-6: Preserve selection on revisit', () => {

      it('T-6.1: should pre-select "Claimant" when previously selected', async () => {
        await navigateToStatementOfTruth(testSession);
        await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'claimant' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/value="claimant"[^>]*checked/);
      });

      it('T-6.2: should pre-select "Claimant\'s legal representative" when previously selected', async () => {
        await navigateToStatementOfTruth(testSession);
        await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'legal-representative' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/value="legal-representative"[^>]*checked/);
      });

      it('T-6.3: should have no pre-selection on first visit', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).not.toMatch(/value="claimant"[^>]*checked/);
        expect(response.text).not.toMatch(/value="legal-representative"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/statement-of-truth', () => {

    describe('AC-4: Selection is required (Validation)', () => {

      it('T-4.1: should show error when no selection made', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select who completed this statement');
      });

      it('T-4.2: should display GOV.UK error summary', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('T-4.3: should have error link targeting radio group', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#completedBy"/);
      });

    });

    describe('AC-5: Persist completed by selection', () => {

      it('T-5.1: should store "claimant" when Claimant selected', async () => {
        await navigateToStatementOfTruth(testSession);
        await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'claimant' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/value="claimant"[^>]*checked/);
      });

      it('T-5.2: should store "legal-representative" when legal representative selected', async () => {
        await navigateToStatementOfTruth(testSession);
        await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'legal-representative' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/value="legal-representative"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation', () => {

      it('T-7.1: should redirect to /claims/completing-your-claim when Previous clicked', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/completing-your-claim');
      });

    });

    describe('AC-8: Continue navigation', () => {

      it('T-8.1: should redirect to /claims/check-your-answers when "claimant" selected', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'claimant' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/check-your-answers');
      });

      it('T-8.2: should redirect to /claims/check-your-answers when "legal-representative" selected', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({ completedBy: 'legal-representative' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/check-your-answers');
      });

    });

    describe('AC-9: Cancel behaviour', () => {

      it('T-9.1: should redirect to /case-list when Cancel clicked', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-10: Accessibility compliance', () => {

      it('T-10.1: should display GOV.UK error summary on validation failure', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('T-10.2: should have error summary with tabindex for focus', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('T-10.3: should have properly labelled radio inputs', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .get('/claims/statement-of-truth')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

    describe('AC-11: Page title reflects error state', () => {

      it('T-11.1: should prefix page title with "Error:" on validation failure', async () => {
        await navigateToStatementOfTruth(testSession);
        const response = await testSession
          .post('/claims/statement-of-truth')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<title>Error:/);
      });

    });

  });

});
