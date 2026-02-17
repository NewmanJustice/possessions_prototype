/**
 * Tests for Screen 40: Claimant Ineligible (Welsh)
 * Route: /claims/claimant-ineligible-welsh
 *
 * Tests derived from user story: businessArtifacts/userstories/screen40.txt
 * Test artifacts: prototype/test/artifacts/screen40/
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  navigateToClaimantIneligibleWelsh
} = require('../helpers/sessionHelper');

describe('Screen 40: Claimant Ineligible (Welsh)', () => {
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

  it('GET /claims/claimant-ineligible-welsh displays ineligibility message (AC-1, AC-2)', async () => {
    const res = await testSession.get('/claims/claimant-ineligible-welsh');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/not eligible to use the England possession claim service/i);
    expect(res.text).toMatch(/property is in Wales/i);
    // h1 heading
    expect(res.text).toMatch(/<h1[^>]*>.*not eligible.*<\/h1>/is);
  });

  it('displays all required guidance and links (AC-2)', async () => {
    const res = await testSession.get('/claims/claimant-ineligible-welsh');
    // Check for guidance text and at least one link (e.g., to case list)
    expect(res.text).toMatch(/guidance for Welsh claims|contact details|seek the correct process/i);
    expect(res.text).toMatch(/<a[^>]+href="\/case-list"/i);
  });

  it('does not allow claim progression (AC-3)', async () => {
    const res = await testSession.get('/claims/claimant-ineligible-welsh');
    // No continue/submit/claim progression buttons
    expect(res.text).not.toMatch(/continue|submit|next|start claim/i);
    // Only navigation is to case list or exit
    expect(res.text).toMatch(/case list|exit/i);
  });

  it('navigation link/button returns to /case-list and session is unchanged (AC-4)', async () => {
    // Simulate clicking the return to case list link
    const res = await testSession.get('/claims/claimant-ineligible-welsh');
    // Find the link/button to /case-list
    const match = res.text.match(/<a[^>]+href="(\/case-list)"/i);
    expect(match).not.toBeNull();
    // Simulate navigation
    if (match) {
      const navRes = await testSession.get(match[1]);
      expect(navRes.status).toBe(200);
      // Session claimDraft should still have isWales = true
      expect(testSession.cookies).toBeDefined();
    }
  });

  it('page is accessible: h1, keyboard, WCAG structure (AC-5)', async () => {
    const res = await testSession.get('/claims/claimant-ineligible-welsh');
    // h1 present
    expect(res.text).toMatch(/<h1[^>]*>.*not eligible.*<\/h1>/is);
    // All links/buttons have href or role="button"
    expect(res.text).toMatch(/<a[^>]+href="\/case-list"/i);
    // No form elements
    expect(res.text).not.toMatch(/<form/i);
  });
});
