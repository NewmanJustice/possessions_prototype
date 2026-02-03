/**
 * Tests for Screen 38: Check Your Answers
 * Route: /claims/check-your-answers
 *
 * Tests derived from user story: businessArtifacts/userstories/screen38.txt
 * Test artifacts: prototype/test/artifacts/screen38/
 *
 * Note: This is a READ-ONLY summary page with NO form validation.
 * Tests focus on content display, navigation, and accessibility.
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToStatementOfTruth
} = require('../helpers/sessionHelper');

describe('Screen 38: Check Your Answers', () => {
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
   * Helper to navigate to Screen 38 via Screen 37
   */
  async function navigateToCheckYourAnswers(agent) {
    await navigateToStatementOfTruth(agent);

    // Screen 37: Submit statement of truth
    await agent
      .post('/claims/statement-of-truth')
      .send({ completedBy: 'claimant' })
      .expect(302);

    return agent;
  }

  describe('GET /claims/check-your-answers', () => {

    describe('AC-1: Display page heading and case number', () => {

      it('T-1.1: should display page heading "Check your answers"', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Check your answers');
      });

      it('T-1.2: should display case number', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display summary in GOV.UK summary list format', () => {

      it('T-2.1: should display summary list with GOV.UK CSS class', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('govuk-summary-list');
      });

      it('T-2.2: should use semantic dl element for summary list', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/<dl[^>]*class="[^"]*govuk-summary-list/);
      });

      it('T-2.3: should contain summary rows with key, value, and actions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('govuk-summary-list__key');
        expect(response.text).toContain('govuk-summary-list__value');
        expect(response.text).toContain('govuk-summary-list__actions');
      });

    });

    describe('AC-3: Display property address section', () => {

      it('T-3.1: should display property address question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/address.*property/i);
      });

      it('T-3.2: should display property address value', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        // Check for illustrative address data
        expect(response.text).toMatch(/Luton|Garden Drive|LU1/i);
      });

      it('T-3.3: should have Change link for property address', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-4: Display claimant details section', () => {

      it('T-4.1: should display claimant-related questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/claimant/i);
      });

      it('T-4.2: should have Change links for claimant questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        // Multiple Change links should exist
        const changeCount = (response.text.match(/Change</g) || []).length;
        expect(changeCount).toBeGreaterThan(1);
      });

    });

    describe('AC-5: Display defendant details section', () => {

      it('T-5.1: should display defendant-related questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/defendant/i);
      });

      it('T-5.2: should have Change links for defendant questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-6: Display tenancy information section', () => {

      it('T-6.1: should display tenancy type question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/tenancy|licence/i);
      });

      it('T-6.2: should display tenancy start date question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/date.*start|start.*date/i);
      });

      it('T-6.3: should have Change links for tenancy questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-7: Display grounds for possession section', () => {

      it('T-7.1: should display grounds for possession question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/grounds.*possession/i);
      });

      it('T-7.2: should display pre-action protocol question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/pre-action protocol/i);
      });

      it('T-7.3: should have Change links for grounds questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-8: Display rent arrears section', () => {

      it('T-8.1: should display rent amount question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/rent/i);
      });

      it('T-8.2: should display total rent arrears question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/arrears/i);
      });

      it('T-8.3: should have Change links for rent questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-9: Display applications section', () => {

      it('T-9.1: should display money judgement question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/judgement|judgment|arrears/i);
      });

      it('T-9.2: should have Change links for application questions', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-10: Display statement of truth section', () => {

      it('T-10.1: should display statement of truth completed by question', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/statement of truth|completed by/i);
      });

      it('T-10.2: should have Change link for statement of truth', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

    });

    describe('AC-11: Change links are illustrative only', () => {

      it('T-11.1: should display Change links on the page', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Change');
      });

      it('T-11.2: should have multiple Change links across summary sections', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        const changeCount = (response.text.match(/>Change</g) || []).length;
        expect(changeCount).toBeGreaterThan(5);
      });

    });

    describe('AC-12: Summary data can be hardcoded for prototype', () => {

      it('T-12.1: should display illustrative data values', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        // Check for some illustrative hardcoded data
        expect(response.text).toMatch(/Yes|No|Claimant/i);
      });

    });

    describe('AC-14: Submit and pay button', () => {

      it('T-14.2: should display Submit and pay button with correct text', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('Submit and pay');
      });

    });

    describe('AC-16: Accessibility compliance', () => {

      it('T-16.1: should use proper semantic HTML dl element', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/<dl/);
        expect(response.text).toMatch(/<dt/);
        expect(response.text).toMatch(/<dd/);
      });

      it('T-16.2: should have accessible Change links with visually hidden text', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toContain('govuk-visually-hidden');
      });

      it('T-16.3: should have navigable form elements and links', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .get('/claims/check-your-answers')
          .expect(200);
        expect(response.text).toMatch(/<form/);
        expect(response.text).toMatch(/<button/);
        expect(response.text).toMatch(/<a[^>]*href/);
      });

    });

  });

  describe('POST /claims/check-your-answers', () => {

    describe('AC-13: Previous navigation', () => {

      it('T-13.1: should redirect to /claims/statement-of-truth when Previous clicked', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .post('/claims/check-your-answers')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-truth');
      });

    });

    describe('AC-14: Submit and pay navigation', () => {

      it('T-14.1: should redirect to /claims/pay-claim-fee when Submit and pay clicked', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .post('/claims/check-your-answers')
          .send({})
          .expect(302);
        expect(response.headers.location).toBe('/claims/pay-claim-fee');
      });

    });

    describe('AC-15: Cancel behaviour', () => {

      it('T-15.1: should redirect to /case-list when Cancel clicked', async () => {
        await navigateToCheckYourAnswers(testSession);
        const response = await testSession
          .post('/claims/check-your-answers')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

  });

});
