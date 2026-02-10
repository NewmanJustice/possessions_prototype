/**
 * Integration Tests for Journey Map Feature
 * Tests panel markup and trigger link visibility on various pages.
 *
 * Note: JavaScript behaviour (animations, focus trap, expand/collapse)
 * requires browser automation and is out of scope for Jest/Supertest.
 */

const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Journey Map Feature', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
  });

  afterEach(() => {
    if (testSession) {
      testSession.destroy();
    }
  });

  describe('Trigger Link Visibility', () => {

    describe('Claims pages (should show trigger link)', () => {

      it('should display "View journey map" link on /claims/start', async () => {
        await createAuthenticatedSession(testSession);
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toContain('View journey map');
        expect(response.text).toMatch(/id="open-journey-map"/);
      });

      it('should display trigger link on /claims/eligibility', async () => {
        await createAuthenticatedSession(testSession);
        await testSession.post('/claims/start').send({});

        const response = await testSession
          .get('/claims/eligibility')
          .expect(200);

        expect(response.text).toContain('View journey map');
      });

      it('should display trigger link on /claims/border-postcode', async () => {
        await createAuthenticatedSession(testSession);
        await testSession.post('/claims/start').send({});
        await testSession.post('/claims/eligibility').send({});

        const response = await testSession
          .get('/claims/border-postcode')
          .expect(200);

        expect(response.text).toContain('View journey map');
      });

      it('should display trigger link on /claims/claimant-type', async () => {
        await createAuthenticatedSession(testSession);
        await testSession.post('/claims/start').send({});
        await testSession.post('/claims/eligibility').send({});
        await testSession.post('/claims/border-postcode')
          .send({ propertyLocation: 'england' });

        const response = await testSession
          .get('/claims/claimant-type')
          .expect(200);

        expect(response.text).toContain('View journey map');
      });

      it('should have trigger link with consistent ID', async () => {
        await createAuthenticatedSession(testSession);
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/id="open-journey-map"/);
      });

      it('should have trigger link as anchor element', async () => {
        await createAuthenticatedSession(testSession);
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/<a[^>]*id="open-journey-map"[^>]*>/);
      });

    });

    describe('Non-claims pages (should NOT show trigger link)', () => {

      it('should NOT display trigger link on /case-list', async () => {
        await createAuthenticatedSession(testSession);
        const response = await testSession
          .get('/case-list')
          .expect(200);

        expect(response.text).not.toContain('View journey map');
        expect(response.text).not.toMatch(/id="open-journey-map"/);
      });

      it('should NOT display trigger link on /possessions', async () => {
        await createAuthenticatedSession(testSession);
        const response = await testSession
          .get('/possessions')
          .expect(200);

        expect(response.text).not.toContain('View journey map');
      });

      it('should NOT display trigger link on /auth/sign-in', async () => {
        // Access granted but not signed in
        await testSession
          .post('/access')
          .send({ accessCode: 'letmein' });
        await testSession
          .post('/select-user-type')
          .send({ userType: 'professional' });

        const response = await testSession
          .get('/auth/sign-in')
          .expect(200);

        expect(response.text).not.toContain('View journey map');
      });

      it('should NOT display trigger link on /access', async () => {
        const response = await testSession
          .get('/access')
          .expect(200);

        expect(response.text).not.toContain('View journey map');
      });

      it('should NOT display trigger link on /health', async () => {
        const response = await testSession
          .get('/health')
          .expect(200);

        // Health endpoint returns JSON, not HTML
        expect(response.text).not.toContain('View journey map');
      });

    });

  });

  describe('Panel Markup on Claims Pages', () => {

    beforeEach(async () => {
      await createAuthenticatedSession(testSession);
    });

    describe('Panel container', () => {

      it('should include panel overlay container', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/id="journey-map-overlay"/);
      });

      it('should include panel element', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/id="journey-map-panel"/);
      });

      it('should have panel with role="dialog"', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/role="dialog"/);
      });

      it('should have panel with aria-modal="true"', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/aria-modal="true"/);
      });

      it('should have panel with aria-labelledby', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/aria-labelledby="journey-map-title"/);
      });

      it('should have panel initially hidden', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        // Check for hidden attribute on overlay
        expect(response.text).toMatch(/id="journey-map-overlay"[^>]*hidden/);
      });

    });

    describe('Panel header', () => {

      it('should display panel title "Your claim journey"', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toContain('Your claim journey');
      });

      it('should have title with correct ID', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/id="journey-map-title"[^>]*>.*Your claim journey/s);
      });

      it('should include close button', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/id="close-journey-map"/);
      });

      it('should have close button with accessible label', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        // Either aria-label or visible "Close" text
        expect(response.text).toMatch(/close-journey-map[^>]*(aria-label|>Close)/i);
      });

    });

    describe('Zone display', () => {

      it('should render Eligibility zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toContain('Eligibility');
      });

      it('should render Claim Type zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Claim Type/);
      });

      it('should render Claimant Details zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Claimant Details/);
      });

      it('should render Defendant Details zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Defendant Details/);
      });

      it('should render Property & Tenancy zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Property.*Tenancy/);
      });

      it('should render Grounds for Possession zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Grounds.*Possession/i);
      });

      it('should render Pre-action & Notice zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Pre-action.*Notice/i);
      });

      it('should render Rent & Arrears zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Rent.*Arrears/i);
      });

      it('should render Money Judgment zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Money.*Judg/i);
      });

      it('should render Alternatives zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toContain('Alternatives');
      });

      it('should render Additional Info zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/Additional Info/);
      });

      it('should render Submit zone', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toContain('Submit');
      });

    });

    describe('Station display', () => {

      it('should render station elements within zones', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/journey-map-station/);
      });

      it('should render station markers', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/journey-map-station-marker/);
      });

      it('should render station titles', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/journey-map-station-title/);
      });

      it('should have expandable station elements', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        // Stations should have aria-expanded attribute
        expect(response.text).toMatch(/aria-expanded/);
      });

    });

    describe('Accessibility attributes', () => {

      it('should have focusable panel (tabindex)', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/journey-map-panel[^>]*tabindex="-1"/);
      });

      it('should have backdrop element for click-to-close', async () => {
        const response = await testSession
          .get('/claims/start')
          .expect(200);

        expect(response.text).toMatch(/journey-map-backdrop/);
      });

    });

  });

  describe('Panel NOT on Non-Claims Pages', () => {

    it('should NOT include panel markup on /case-list', async () => {
      await createAuthenticatedSession(testSession);
      const response = await testSession
        .get('/case-list')
        .expect(200);

      expect(response.text).not.toMatch(/id="journey-map-panel"/);
    });

    it('should NOT include panel markup on /possessions', async () => {
      await createAuthenticatedSession(testSession);
      const response = await testSession
        .get('/possessions')
        .expect(200);

      expect(response.text).not.toMatch(/id="journey-map-panel"/);
    });

  });

});
