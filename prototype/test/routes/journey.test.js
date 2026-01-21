const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Complete Claims Journey', () => {
  describe('Happy Path - Full Journey', () => {
    it('should navigate from access to name-of-claimant successfully', async () => {
      const testSession = session(app);

      // Step 1: Access code
      const accessResponse = await testSession
        .post('/access')
        .send({ accessCode: process.env.ACCESS_CODE || 'letmein' });
      expect(accessResponse.status).toBe(302);
      expect(accessResponse.headers.location).toBe('/select-user-type');

      // Step 2: User type selection
      const userTypeResponse = await testSession
        .post('/select-user-type')
        .send({ userType: 'professional' });
      expect(userTypeResponse.status).toBe(302);
      expect(userTypeResponse.headers.location).toBe('/auth/sign-in');

      // Step 3: Sign in
      const signInResponse = await testSession
        .post('/auth/sign-in')
        .send({
          email: 'test@solicitor.com',
          password: 'password123'
        });
      expect(signInResponse.status).toBe(302);
      expect(signInResponse.headers.location).toBe('/auth/one-time-code');

      // Step 4: 2FA
      const twoFaResponse = await testSession
        .post('/auth/one-time-code')
        .send({ code: '123456' });
      expect(twoFaResponse.status).toBe(302);
      expect(twoFaResponse.headers.location).toBe('/case-list');

      // Step 5: Case list landing
      const caseListResponse = await testSession.get('/case-list');
      expect(caseListResponse.status).toBe(200);
      expect(caseListResponse.text).toContain('Case list');

      // Step 6: Start claim
      const startResponse = await testSession.post('/claims/start').send({});
      expect(startResponse.status).toBe(302);
      expect(startResponse.headers.location).toBe('/claims/eligibility');

      // Step 7: Eligibility warning
      const eligibilityResponse = await testSession.post('/claims/eligibility').send({});
      expect(eligibilityResponse.status).toBe(302);
      expect(eligibilityResponse.headers.location).toBe('/claims/border-postcode');

      // Step 8: Border postcode (England)
      const borderResponse = await testSession
        .post('/claims/border-postcode')
        .send({ propertyLocation: 'england' });
      expect(borderResponse.status).toBe(302);
      expect(borderResponse.headers.location).toBe('/claims/claimant-type');

      // Step 9: Claimant type (registered provider - happy path)
      const claimantTypeResponse = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'registered-provider' });
      expect(claimantTypeResponse.status).toBe(302);
      expect(claimantTypeResponse.headers.location).toBe('/claims/claim-type');

      // Step 10: Claim type (not trespassers - happy path)
      const claimTypeResponse = await testSession
        .post('/claims/claim-type')
        .send({ claimType: 'no' });
      expect(claimTypeResponse.status).toBe(302);
      expect(claimTypeResponse.headers.location).toBe('/claims/name-of-claimant');

      // Step 11: Name of claimant (placeholder - just verify renders)
      const nameOfClaimantResponse = await testSession.get('/claims/name-of-claimant');
      expect(nameOfClaimantResponse.status).toBe(200);
    });
  });

  describe('Bad Path - Claimant Type Ineligibility', () => {
    it('should handle private landlord ineligibility correctly', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      // Navigate to claimant-type
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });

      // Select ineligible claimant type
      const claimantTypeResponse = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'private-landlord' });
      expect(claimantTypeResponse.status).toBe(302);
      expect(claimantTypeResponse.headers.location).toBe('/claims/claimant-ineligible');

      // Verify ineligible page renders
      const ineligiblePageResponse = await testSession.get('/claims/claimant-ineligible');
      expect(ineligiblePageResponse.status).toBe(200);
      expect(ineligiblePageResponse.text).toContain('not eligible');

      // Continue from ineligible page should return to start
      const continueResponse = await testSession.post('/claims/claimant-ineligible').send({});
      expect(continueResponse.status).toBe(302);
      expect(continueResponse.headers.location).toBe('/claims/start');
    });

    it('should handle mortgage lender ineligibility correctly', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });

      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'mortgage-lender' });
      expect(response.headers.location).toBe('/claims/claimant-ineligible');
    });

    it('should handle other claimant type ineligibility correctly', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });

      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'other' });
      expect(response.headers.location).toBe('/claims/claimant-ineligible');
    });
  });

  describe('Bad Path - Trespasser Claim Ineligibility', () => {
    it('should handle trespasser claim ineligibility correctly', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      // Navigate to claim-type via happy path
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'registered-provider' });

      // Select trespasser (ineligible)
      const claimTypeResponse = await testSession
        .post('/claims/claim-type')
        .send({ claimType: 'yes' });
      expect(claimTypeResponse.status).toBe(302);
      expect(claimTypeResponse.headers.location).toBe('/claims/claim-type-ineligible');

      // Verify ineligible page renders
      const ineligiblePageResponse = await testSession.get('/claims/claim-type-ineligible');
      expect(ineligiblePageResponse.status).toBe(200);
      expect(ineligiblePageResponse.text).toContain('cannot make a trespass claim');

      // Continue should return to start
      const continueResponse = await testSession.post('/claims/claim-type-ineligible').send({});
      expect(continueResponse.status).toBe(302);
      expect(continueResponse.headers.location).toBe('/claims/start');
    });
  });

  describe('Session Persistence', () => {
    it('should maintain session state throughout journey', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      // Start claim and progress
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'wales' });

      // Session should persist - verify by accessing previous step
      const borderResponse = await testSession.get('/claims/border-postcode');
      expect(borderResponse.status).toBe(200);

      // Continue journey
      await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'registered-provider' });

      // Should still be authenticated
      const caseListResponse = await testSession.get('/case-list');
      expect(caseListResponse.status).toBe(200);
    });
  });

  describe('Back Navigation', () => {
    it('should allow navigating back through journey', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);

      // Progress forward
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'registered-provider' });

      // Navigate back
      const borderResponse = await testSession.get('/claims/border-postcode');
      expect(borderResponse.status).toBe(200);

      const eligibilityResponse = await testSession.get('/claims/eligibility');
      expect(eligibilityResponse.status).toBe(200);

      const startResponse = await testSession.get('/claims/start');
      expect(startResponse.status).toBe(200);
    });
  });
});

// TODO: Add complete journey test for full submission flow when implemented
// This will include: property-address, claimant, defendant, grounds, key-dates,
// check-answers, submit, and confirmation pages
