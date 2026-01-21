const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession, navigateToClaimsStep } = require('../helpers/sessionHelper');

describe('Claims Journey Routes', () => {
  describe('GET /claims/start', () => {
    it('should render start page for authenticated user', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.get('/claims/start');
      expect(response.status).toBe(200);
      expect(response.text).toContain('possession claim');
    });

    it('should redirect unauthenticated users', async () => {
      const response = await request(app).get('/claims/start');
      expect(response.status).toBe(302);
    });
  });

  describe('POST /claims/start', () => {
    it('should redirect to eligibility page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      
      const response = await testSession.post('/claims/start').send({});
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/eligibility');
    });
  });

  describe('GET /claims/eligibility', () => {
    it('should render eligibility warning page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      
      const response = await testSession.get('/claims/eligibility');
      expect(response.status).toBe(200);
      expect(response.text).toContain('eligible');
    });
  });

  describe('POST /claims/eligibility', () => {
    it('should redirect to border-postcode page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      
      const response = await testSession.post('/claims/eligibility').send({});
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/border-postcode');
    });
  });

  describe('GET /claims/border-postcode', () => {
    it('should render border postcode page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      
      const response = await testSession.get('/claims/border-postcode');
      expect(response.status).toBe(200);
      expect(response.text).toContain('England');
      expect(response.text).toContain('Wales');
    });
  });

  describe('POST /claims/border-postcode', () => {
    it('should reject empty selection', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});

      const postResponse = await testSession
        .post('/claims/border-postcode')
        .send({ propertyLocation: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/claims/border-postcode');

      const getResponse = await testSession.get('/claims/border-postcode');
      expect(getResponse.text).toContain('Select whether the property is in England or Wales');
    });

    it('should accept England and redirect to claimant-type', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      
      const response = await testSession
        .post('/claims/border-postcode')
        .send({ propertyLocation: 'england' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claimant-type');
    });

    it('should accept Wales and redirect to claimant-type', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      
      const response = await testSession
        .post('/claims/border-postcode')
        .send({ propertyLocation: 'wales' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claimant-type');
    });
  });

  describe('GET /claims/claimant-type', () => {
    it('should render claimant type page with case number', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      
      const response = await testSession.get('/claims/claimant-type');
      expect(response.status).toBe(200);
      expect(response.text).toContain('1234-5678-9101-1213'); // Case number
      expect(response.text).toContain('claimant');
    });
  });

  describe('POST /claims/claimant-type - Happy Path', () => {
    it('should accept registered provider and redirect to claim-type', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      
      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'registered-provider' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claim-type');
    });
  });

  describe('POST /claims/claimant-type - Bad Paths', () => {
    it('should redirect private landlord to ineligible page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      
      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'private-landlord' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claimant-ineligible');
    });

    it('should redirect mortgage lender to ineligible page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      
      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'mortgage-lender' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claimant-ineligible');
    });

    it('should redirect other to ineligible page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      
      const response = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: 'other' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claimant-ineligible');
    });

    it('should reject empty selection', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });

      const postResponse = await testSession
        .post('/claims/claimant-type')
        .send({ claimantType: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/claims/claimant-type');

      const getResponse = await testSession.get('/claims/claimant-type');
      expect(getResponse.text).toContain('Select who the claimant is');
    });
  });

  describe('GET /claims/claimant-ineligible', () => {
    it('should render ineligibility page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'private-landlord' });
      
      const response = await testSession.get('/claims/claimant-ineligible');
      expect(response.status).toBe(200);
      expect(response.text).toContain('not eligible');
    });
  });

  describe('POST /claims/claimant-ineligible', () => {
    it('should redirect back to start page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'private-landlord' });
      
      const response = await testSession.post('/claims/claimant-ineligible').send({});
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/start');
    });
  });

  describe('GET /claims/claim-type', () => {
    it('should render claim type page with case number', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      
      const response = await testSession.get('/claims/claim-type');
      expect(response.status).toBe(200);
      expect(response.text).toContain('1234-5678-9101-1213');
      expect(response.text).toContain('trespasser');
    });
  });

  describe('POST /claims/claim-type - Happy Path', () => {
    it('should accept "no" (not trespassers) and redirect to name-of-claimant', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      
      const response = await testSession
        .post('/claims/claim-type')
        .send({ claimType: 'no' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/name-of-claimant');
    });
  });

  describe('POST /claims/claim-type - Bad Path', () => {
    it('should redirect "yes" (trespassers) to ineligible page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      
      const response = await testSession
        .post('/claims/claim-type')
        .send({ claimType: 'yes' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/claim-type-ineligible');
    });

    it('should reject empty selection', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });

      const postResponse = await testSession
        .post('/claims/claim-type')
        .send({ claimType: '' });

      expect(postResponse.status).toBe(302);
      expect(postResponse.headers.location).toBe('/claims/claim-type');

      const getResponse = await testSession.get('/claims/claim-type');
      expect(getResponse.text).toContain('Select yes if this is a claim against trespassers');
    });
  });

  describe('GET /claims/claim-type-ineligible', () => {
    it('should render ineligibility page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      await testSession.post('/claims/claim-type').send({ claimType: 'yes' });
      
      const response = await testSession.get('/claims/claim-type-ineligible');
      expect(response.status).toBe(200);
      expect(response.text).toContain('cannot make a trespass claim');
    });
  });

  describe('POST /claims/claim-type-ineligible', () => {
    it('should redirect back to start page', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      await testSession.post('/claims/claim-type').send({ claimType: 'yes' });
      
      const response = await testSession.post('/claims/claim-type-ineligible').send({});
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/start');
    });
  });

  describe('GET /claims/name-of-claimant', () => {
    it('should render placeholder page after successful claim type selection', async () => {
      const testSession = session(app);
      await createAuthenticatedSession(testSession);
      await testSession.post('/claims/start').send({});
      await testSession.post('/claims/eligibility').send({});
      await testSession.post('/claims/border-postcode').send({ propertyLocation: 'england' });
      await testSession.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
      await testSession.post('/claims/claim-type').send({ claimType: 'no' });
      
      const response = await testSession.get('/claims/name-of-claimant');
      expect(response.status).toBe(200);
      // Placeholder page - just verify it renders
    });
  });
});

// TODO: Add tests for old flow routes when they are re-implemented
// These routes exist but are currently bypassed:
// - /claims/property-address
// - /claims/claimant
// - /claims/defendant
// - /claims/grounds
// - /claims/key-dates
// - /claims/documents
// - /claims/check-answers
// - /claims/confirmation
