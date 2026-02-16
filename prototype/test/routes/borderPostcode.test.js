const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Border Postcode (Welsh Branching)', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
    await createAuthenticatedSession(testSession);
  });

  it('GET /claims/border-postcode renders the page', async () => {
    const res = await testSession.get('/claims/border-postcode');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Where is the property located?');
  });

  it('POST Wales sets isWales=true and redirects', async () => {
    const res = await testSession.post('/claims/border-postcode').send({ borderNation: 'wales' });
    expect(res.status).toBe(302);
    // TODO: Check redirect location
    expect(testSession.cookies).toBeDefined();
    // TODO: Check session.claimDraft.isWales === true
  });

  it('POST England sets isWales=false and redirects', async () => {
    const res = await testSession.post('/claims/border-postcode').send({ borderNation: 'england' });
    expect(res.status).toBe(302);
    // TODO: Check redirect location
    // TODO: Check session.claimDraft.isWales === false
  });

  it('POST with no selection shows error', async () => {
    const res = await testSession.post('/claims/border-postcode').send({});
    expect(res.status).toBe(302);
    // Should redirect back to same page
    // TODO: Check error in session
  });

  it('Previous button returns to /claims/start and preserves data', async () => {
    // TODO: Simulate previous navigation
  });

  it('Cancel button returns to /case-list and preserves draft', async () => {
    // TODO: Simulate cancel navigation
  });
});
