/**
 * Tests for Screen 39: Pay Claim Fee
 * Route: /claims/pay-claim-fee
 *
 * Tests derived from user story: businessArtifacts/userstories/screen39.txt
 * Test artifacts: prototype/test/artifacts/screen39/
 *
 * Note: This is the FINAL screen in the claims journey.
 * It is a GET-only, read-only confirmation/payment redirect page.
 * No form inputs, no POST handler, no Previous button, no Cancel link.
 * All payment links/buttons redirect to /case-list (prototype behaviour).
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToCheckYourAnswers
} = require('../helpers/sessionHelper');

describe('Screen 39: Pay Claim Fee', () => {
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
   * Helper to navigate to Screen 39 via Screen 38
   */
  async function navigateToPayClaimFee(agent) {
    await navigateToCheckYourAnswers(agent);

    // Screen 38: Submit and pay
    await agent
      .post('/claims/check-your-answers')
      .send({})
      .expect(302);

    return agent;
  }

  describe('GET /claims/pay-claim-fee', () => {

    describe('AC-1: Display page heading', () => {

      it('T-1.1: should display page heading "Pay claim fee"', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('Pay claim fee');
      });

      it('T-1.2: should use h1 element for page heading', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/<h1[^>]*class="[^"]*govuk-heading-l[^"]*"[^>]*>.*Pay claim fee/s);
      });

    });

    describe('AC-2: Display case number', () => {

      it('T-2.1: should display case number text on the page', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

      it('T-2.2: should display case number in expected format', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check for case number pattern (e.g., 1234-5678-9101-1213)
        expect(response.text).toMatch(/\d{4}-\d{4}-\d{4}-\d{4}/);
      });

    });

    describe('AC-3: Display primary payment button', () => {

      it('T-3.1: should display "Pay £404 claim fee" button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('Pay £404 claim fee');
      });

      it('T-3.2: should style payment button as start button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('govuk-button--start');
      });

      it('T-3.3: should include £404 amount in payment button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/Pay.*£404/);
      });

    });

    describe('AC-4: Display payment section heading', () => {

      it('T-4.1: should display "Make a payment" heading', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('Make a payment');
      });

      it('T-4.2: should use appropriate heading level (h2) for section heading', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/<h2[^>]*>.*Make a payment/s);
      });

    });

    describe('AC-5: Display payment instruction text', () => {

      it('T-5.1: should display instruction text mentioning £404 claim fee', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/pay the claim fee of £404/i);
      });

      it('T-5.2: should explain claim will not progress until fee is paid', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/claim will not progress until.*paid/i);
      });

      it('T-5.3: should include "Pay the claim fee" link within text', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/<a[^>]*>Pay the claim fee<\/a>/);
      });

    });

    describe('AC-6: Display close and return button', () => {

      it('T-6.1: should display "Close and return to case details" button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('Close and return to case details');
      });

      it('T-6.2: should style close button as secondary button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('govuk-button--secondary');
      });

    });

    describe('AC-7: Pay claim fee button navigation', () => {

      it('T-7.1: should link payment button to /case-list', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check that the start button links to /case-list
        expect(response.text).toMatch(/govuk-button--start[^>]*href="\/case-list"|href="\/case-list"[^>]*govuk-button--start/);
      });

    });

    describe('AC-8: Pay the claim fee link navigation', () => {

      it('T-8.1: should link "Pay the claim fee" text to /case-list', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/<a[^>]*href="\/case-list"[^>]*>Pay the claim fee<\/a>/);
      });

    });

    describe('AC-9: Close and return navigation', () => {

      it('T-9.1: should link close button to /case-list', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check that the secondary button links to /case-list
        expect(response.text).toMatch(/govuk-button--secondary[^>]*href="\/case-list"|href="\/case-list"[^>]*govuk-button--secondary/);
      });

    });

    describe('AC-10: No Previous button', () => {

      it('T-10.1: should NOT display a Previous button', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check that there is no Previous button text in a button context
        expect(response.text).not.toMatch(/>Previous</);
      });

      it('T-10.2: should NOT have action="previous" form element', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).not.toContain('value="previous"');
      });

    });

    describe('AC-11: No Cancel link', () => {

      it('T-11.1: should NOT display a Cancel link', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check that there is no Cancel link
        expect(response.text).not.toMatch(/>Cancel</);
      });

    });

    describe('AC-12: Accessibility compliance', () => {

      it('T-12.1: should have proper h1 heading', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toMatch(/<h1/);
      });

      it('T-12.2: should use govuk-button component for buttons', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        expect(response.text).toContain('govuk-button');
      });

      it('T-12.3: should have keyboard accessible links with href attribute', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check for links with href attributes
        expect(response.text).toMatch(/<a[^>]*href=/);
      });

      it('T-12.4: should have logical page structure (h1 followed by content)', async () => {
        await navigateToPayClaimFee(testSession);
        const response = await testSession
          .get('/claims/pay-claim-fee')
          .expect(200);
        // Check that h1 appears before h2
        const h1Index = response.text.indexOf('<h1');
        const h2Index = response.text.indexOf('<h2');
        expect(h1Index).toBeLessThan(h2Index);
      });

    });

  });

  describe('Route protection', () => {

    it('should require authentication to access page', async () => {
      // Create a new session without authentication
      const unauthenticatedSession = session(app);
      const response = await unauthenticatedSession
        .get('/claims/pay-claim-fee')
        .expect(302);
      // Should redirect to auth or access page
      expect(response.headers.location).toMatch(/\/auth|\/access|\/select-user-type/);
      unauthenticatedSession.destroy();
    });

  });

});
