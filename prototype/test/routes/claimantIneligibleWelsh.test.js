/**
 * Tests for welsh-screen1: Claimant Ineligible (Welsh)
 * Route: GET and POST /claims/claimant-ineligible-welsh
 *
 * Tests derived from user story: businessArtifacts/userstories/welsh-screen1.txt
 * Test artifacts: prototype/test/artifacts/welsh-screen1/
 *
 * NOTE: This file REPLACES the original Screen 40 tests.
 * The route is unchanged (/claims/claimant-ineligible-welsh) but the page design
 * has changed from a terminal page (no navigation) to a navigable page with
 * Previous, Continue (POST → /claims/start), and Cancel navigation.
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  navigateToClaimantIneligibleWelsh
} = require('../helpers/sessionHelper');

describe('welsh-screen1: Claimant Ineligible (Welsh)', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
    await navigateToClaimantIneligibleWelsh(testSession, { claimantType: 'company' });
  });

  afterEach(() => {
    if (testSession) {
      testSession.destroy();
    }
  });

  // ---------------------------------------------------------------------------
  // AC-1: Page is rendered for ineligible Welsh claimants
  // ---------------------------------------------------------------------------

  describe('AC-1: Page rendering', () => {

    it('T-1.1: GET /claims/claimant-ineligible-welsh returns HTTP 200', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toBeDefined();
    });

  });

  // ---------------------------------------------------------------------------
  // AC-2: Caption is displayed
  // ---------------------------------------------------------------------------

  describe('AC-2: Caption', () => {

    it('T-2.1: should display caption "Make a claim"', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain('Make a claim');
    });

  });

  // ---------------------------------------------------------------------------
  // AC-3: Heading is displayed
  // ---------------------------------------------------------------------------

  describe('AC-3: h1 heading', () => {

    it("T-3.1: should display h1 heading \"You're not eligible for this online service\"", async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain("You're not eligible for this online service");
    });

    it('T-3.2: should use an h1 element for the page heading', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<h1[^>]*>/);
    });

  });

  // ---------------------------------------------------------------------------
  // AC-4: Horizontal rule separator is displayed
  // ---------------------------------------------------------------------------

  describe('AC-4: Horizontal rule separator', () => {

    it('T-4.1: should include a horizontal rule section break element', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<hr[^>]*>/);
    });

  });

  // ---------------------------------------------------------------------------
  // AC-5: Ineligibility body text is displayed
  // ---------------------------------------------------------------------------

  describe('AC-5: Ineligibility body text', () => {

    it('T-5.1: should display "This service is currently only available for registered community landlords."', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain(
        'This service is currently only available for registered community landlords.'
      );
    });

  });

  // ---------------------------------------------------------------------------
  // AC-6: "What to do next" subheading is displayed
  // ---------------------------------------------------------------------------

  describe('AC-6: "What to do next" subheading', () => {

    it('T-6.1: should display "What to do next" subheading', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain('What to do next');
    });

  });

  // ---------------------------------------------------------------------------
  // AC-7: Form N5 Wales guidance is displayed
  // ---------------------------------------------------------------------------

  describe('AC-7: Form N5 Wales guidance', () => {

    it('T-7.1: should display "Use form N5 Wales and the correct particulars of claim form."', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain(
        'Use form N5 Wales and the correct particulars of claim form.'
      );
    });

  });

  // ---------------------------------------------------------------------------
  // AC-8: "View the full list of property possessions forms" link
  // ---------------------------------------------------------------------------

  describe('AC-8: External forms link', () => {

    it('T-8.1: should display link text "View the full list of property possessions forms (opens in new tab)"', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain(
        'View the full list of property possessions forms (opens in new tab)'
      );
    });

    it('T-8.2: should open the forms link in a new tab (target="_blank")', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<a[^>]*target="_blank"[^>]*>/);
    });

  });

  // ---------------------------------------------------------------------------
  // AC-9: GOV.UK warning text component is displayed
  // ---------------------------------------------------------------------------

  describe('AC-9: Warning text component', () => {

    it('T-9.1: should include the GOV.UK warning text component', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain('govuk-warning-text');
    });

    it("T-9.2: warning text should contain \"To exit back to the case list, select 'Cancel'\"", async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain("To exit back to the case list, select 'Cancel'");
    });

  });

  // ---------------------------------------------------------------------------
  // AC-10: Previous navigation
  // ---------------------------------------------------------------------------

  describe('AC-10: Previous navigation', () => {

    it('T-10.1: should have a link pointing to /claims/claimant-type', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<a[^>]+href="\/claims\/claimant-type"[^>]*>/);
    });

    it('T-10.2: the Previous link should contain the text "Previous"', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/href="\/claims\/claimant-type"[^>]*>[\s\S]*?Previous/);
    });

  });

  // ---------------------------------------------------------------------------
  // AC-11: Continue navigation (POST)
  // ---------------------------------------------------------------------------

  describe('AC-11: Continue navigation (POST)', () => {

    it('T-11.1: page should contain a form with POST method', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<form[^>]+method="post"/i);
    });

    it('T-11.2: POST /claims/claimant-ineligible-welsh returns 302', async () => {
      await testSession
        .post('/claims/claimant-ineligible-welsh')
        .send({})
        .expect(302);
    });

    it('T-11.3: POST /claims/claimant-ineligible-welsh redirects to /claims/start', async () => {
      const response = await testSession
        .post('/claims/claimant-ineligible-welsh')
        .send({})
        .expect(302);
      expect(response.headers.location).toBe('/claims/start');
    });

  });

  // ---------------------------------------------------------------------------
  // AC-12: Cancel behaviour
  // ---------------------------------------------------------------------------

  describe('AC-12: Cancel link', () => {

    it('T-12.1: should have a Cancel link pointing to /case-list', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<a[^>]+href="\/case-list"[^>]*>/);
    });

    it('T-12.2: the Cancel link should contain the text "Cancel"', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/href="\/case-list"[^>]*>[\s\S]*?Cancel/);
    });

  });

  // ---------------------------------------------------------------------------
  // AC-13: Route protection (unauthenticated access)
  // ---------------------------------------------------------------------------

  describe('AC-13: Route protection', () => {

    it('T-13.1: unauthenticated GET redirects to auth or access page', async () => {
      const unauthSession = session(app);
      const response = await unauthSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(302);
      expect(response.headers.location).toMatch(/\/auth|\/access|\/select-user-type/);
      unauthSession.destroy();
    });

  });

  // ---------------------------------------------------------------------------
  // AC-14: Accessibility — page structure
  // ---------------------------------------------------------------------------

  describe('AC-14: Accessibility — page structure', () => {

    it('T-14.1: page has an h1 element', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toMatch(/<h1[^>]*>/);
    });

    it('T-14.2: h1 appears before any h2 in the document', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      const h1Index = response.text.indexOf('<h1');
      const h2Index = response.text.indexOf('<h2');
      // h2 may not exist on this page; if it does, h1 must come first
      if (h2Index !== -1) {
        expect(h1Index).toBeLessThan(h2Index);
      } else {
        expect(h1Index).toBeGreaterThan(-1);
      }
    });

    it('T-14.3: warning text uses govuk-warning-text component class', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain('govuk-warning-text');
    });

    it('T-14.4: external forms link has descriptive accessible text', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).toContain(
        'View the full list of property possessions forms (opens in new tab)'
      );
    });

    it('T-14.5: all links on the page have href attributes', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      // Check that no <a> elements are missing href (excludes fragment-only and JS links)
      const anchorTagsWithoutHref = response.text.match(/<a(?![^>]*href)[^>]*>/gi);
      // Filter out any <a> that are GOV.UK component internals without href (none expected)
      expect(anchorTagsWithoutHref).toBeNull();
    });

  });

  // ---------------------------------------------------------------------------
  // Regression: Old Screen 40 content must NOT appear
  // ---------------------------------------------------------------------------

  describe('Regression: Old Screen 40 content is absent', () => {

    it('T-15.1: should NOT contain "not eligible to use the England possession claim service"', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).not.toContain(
        'not eligible to use the England possession claim service'
      );
    });

    it('T-15.2: should NOT contain the old "property is in Wales" ineligibility message', async () => {
      const response = await testSession
        .get('/claims/claimant-ineligible-welsh')
        .expect(200);
      expect(response.text).not.toMatch(/property is in Wales/i);
    });

  });

});
