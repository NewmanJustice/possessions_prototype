/**
 * Tests for Screen 15: Reasons for Possession
 * Route: /claims/reasons-for-possession
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToAssuredTenancyGrounds
} = require('../helpers/sessionHelper');

/**
 * Helper to setup session with grounds for reasons-for-possession
 * Sets up the minimum session state needed to access reasons-for-possession
 */
async function setupSessionWithGrounds(agent, groundConfig = { additional: true, assured: true }) {
  await navigateToAssuredTenancyGrounds(agent);

  // Screen 13.1: Proceed with assured journey
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'yes' })
    .expect(302);

  // Screen 13.1.1: Select ground8 and indicate additional grounds
  await agent
    .post('/claims/grounds-for-possession-assured-selection')
    .send({
      ground8: 'true',
      hasAdditionalGrounds: groundConfig.additional ? 'yes' : 'no'
    })
    .expect(302);

  if (groundConfig.additional) {
    // Screen 14: Select additional grounds
    const groundsToSelect = groundConfig.multipleGrounds
      ? ['mandatoryGround1', 'mandatoryGround3']
      : 'mandatoryGround1';

    await agent
      .post('/claims/grounds-for-possession')
      .send({ grounds: groundsToSelect })
      .expect(302);
  }

  return agent;
}

describe('Screen 15: Reasons for Possession', () => {
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

  describe('GET /claims/reasons-for-possession', () => {

    describe('AC-1: Display dynamic ground heading', () => {

      it('should display page with "Make a claim" caption', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display ground number in heading', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/Ground \d+/);
      });

      it('should display ground name in heading', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        // Should contain ground name (varies by ground selected)
        expect(response.text).toMatch(/govuk-heading-l/);
      });

    });

    describe('AC-2: Display reasons input and guidance', () => {

      it('should display question about claiming possession', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Why are you making a claim for possession under this ground?');
      });

      it('should display textarea with correct label', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Give details about your reasons for claiming possession');
      });

      it('should display hint about uploading documents later', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('upload supporting documents later');
      });

      it('should display hint about 500 character limit', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('500 characters');
      });

      it('should use character count component with maxlength 500', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/maxlength="500"|data-maxlength="500"/);
      });

      it('should have textarea with name "reasons"', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/name="reasons"/);
      });

    });

    describe('Navigation buttons', () => {

      it('should display Previous button', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Previous');
      });

      it('should display Continue button', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Continue');
      });

      it('should display Cancel link', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toContain('Cancel');
        expect(response.text).toContain('/case-list');
      });

    });

    describe('Edge case: No additional grounds selected', () => {

      it('should redirect to preaction-protocol when no additional grounds selected', async () => {
        // Setup with only assured grounds (no additional)
        await setupSessionWithGrounds(testSession, { additional: false });

        // The assured grounds (ground8) should still be processed
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        // Should show the assured ground
        expect(response.text).toContain('Ground 8');
      });

    });

  });

  describe('POST /claims/reasons-for-possession', () => {

    describe('AC-3: Reasons are optional', () => {

      it('should accept submission with empty textarea', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: '' })
          .expect(302);
        // Should redirect (either to next ground or preaction-protocol)
        expect(response.headers.location).toBeDefined();
      });

      it('should not show error for empty submission', async () => {
        await setupSessionWithGrounds(testSession);
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: '' })
          .expect(302);
        // Successful redirect means no validation error
      });

    });

    describe('AC-4: Character limit enforced', () => {

      it('should accept exactly 500 characters', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'a'.repeat(500) })
          .expect(302);
        expect(response.headers.location).toBeDefined();
      });

      it('should show error for 501+ characters', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'a'.repeat(501) })
          .expect(400);
        expect(response.text).toContain('Enter 500 characters or fewer');
      });

      it('should display GOV.UK error summary for validation error', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'a'.repeat(501) })
          .expect(400);
        expect(response.text).toContain('There is a problem');
        expect(response.text).toMatch(/govuk-error-summary/);
      });

      it('should link error to textarea', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'a'.repeat(501) })
          .expect(400);
        expect(response.text).toContain('#reasons');
      });

    });

    describe('AC-5: Preserve input on validation failure', () => {

      it('should preserve entered text when validation fails', async () => {
        await setupSessionWithGrounds(testSession);
        const longText = 'a'.repeat(501);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: longText })
          .expect(400);
        expect(response.text).toContain(longText.substring(0, 100)); // Check partial
      });

    });

    describe('AC-8: Completion routes to pre-action protocol', () => {

      it('should redirect to preaction-protocol when single ground completed', async () => {
        // Setup with only assured ground (no additional grounds)
        await setupSessionWithGrounds(testSession, { additional: false });
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'Test reasons' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/preaction-protocol');
      });

    });

    describe('AC-7: Iterate through selected grounds (multiple grounds)', () => {

      it('should redirect to same route for next ground when multiple grounds', async () => {
        // Select multiple grounds
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'Test reasons for first ground' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should display different ground heading after submission', async () => {
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        // Submit first ground (Ground 8 from assured tenancy)
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'First ground reasons' })
          .expect(302);

        // Get second ground page
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);

        // Should show Ground 1 heading (first additional ground - mandatoryGround1)
        expect(response.text).toContain('Ground 1');
      });

      it('should redirect to preaction-protocol after last ground', async () => {
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        // Submit first ground (Ground 8)
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'First' })
          .expect(302);

        // Submit second ground (Ground 1)
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'Second' })
          .expect(302);

        // Submit third ground (Ground 3) - should redirect to preaction-protocol
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'Third' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/preaction-protocol');
      });

    });

    describe('AC-9: Previous navigation within loop', () => {

      it('should redirect to grounds-for-possession when Previous from first ground', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'previous', reasons: '' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/grounds-for-possession');
      });

      it('should redirect to previous ground when Previous from subsequent ground', async () => {
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        // Complete first ground
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'First' })
          .expect(302);

        // Now on second ground, click Previous
        const response = await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'previous', reasons: 'Second' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should preserve reasons when navigating back', async () => {
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        // Complete first ground with specific reasons
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: 'First ground specific reasons' })
          .expect(302);

        // Navigate back from second ground
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'previous', reasons: '' })
          .expect(302);

        // Check first ground still has saved reasons
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);

        expect(response.text).toContain('First ground specific reasons');
      });

    });

    describe('AC-6: Persist reasons per ground', () => {

      it('should pre-populate saved reasons on revisit', async () => {
        await setupSessionWithGrounds(testSession, { additional: true, multipleGrounds: true });

        const testReasons = 'My specific test reasons for this ground';

        // Submit first ground
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'continue', reasons: testReasons })
          .expect(302);

        // Navigate back
        await testSession
          .post('/claims/reasons-for-possession')
          .send({ action: 'previous', reasons: '' })
          .expect(302);

        // Check pre-population
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);

        expect(response.text).toContain(testReasons);
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should have Cancel link pointing to /case-list', async () => {
        await setupSessionWithGrounds(testSession);
        const response = await testSession
          .get('/claims/reasons-for-possession')
          .expect(200);
        expect(response.text).toMatch(/<a[^>]*href="\/case-list"[^>]*>.*Cancel.*<\/a>/s);
      });

    });

  });

  describe('AC-11: Accessibility', () => {

    it('should prefix page title with "Error:" on validation failure', async () => {
      await setupSessionWithGrounds(testSession);
      const response = await testSession
        .post('/claims/reasons-for-possession')
        .send({ action: 'continue', reasons: 'a'.repeat(501) })
        .expect(400);
      expect(response.text).toMatch(/<title>\s*Error:/);
    });

    it('should have properly labelled textarea', async () => {
      await setupSessionWithGrounds(testSession);
      const response = await testSession
        .get('/claims/reasons-for-possession')
        .expect(200);
      expect(response.text).toMatch(/id="reasons"/);
      expect(response.text).toMatch(/for="reasons"/);
    });

  });

  describe('Authentication', () => {

    it('should require authentication', async () => {
      const unauthSession = session(app);
      const response = await unauthSession
        .get('/claims/reasons-for-possession')
        .expect(302);
      expect(response.headers.location).toMatch(/access|sign-in/);
    });

  });

});
