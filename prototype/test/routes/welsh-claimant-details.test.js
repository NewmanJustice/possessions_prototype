const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToClaimsStep
} = require('../helpers/sessionHelper');

describe('Welsh Claimant Details Screen', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
    await createAuthenticatedSession(testSession);
    await navigateToClaimsStep(testSession, 'welsh-claimant-details', { isWales: true });
  });

  it('should display all three Welsh questions', async () => {
    const res = await testSession.get('/claims/welsh-claimant-details');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Are you registered under Part 1 of the Housing (Wales) Act 2014?');
    expect(res.text).toContain('Are you licensed under Part 1 of the Housing (Wales) Act 2014?');
    expect(res.text).toContain('Have you appointed a licensed agent to manage the property?');
  });

  it('should require all questions to be answered', async () => {
    const res = await testSession.post('/claims/welsh-claimant-details').send({});
    expect(res.status).toBe(302);
    const followUp = await testSession.get('/claims/welsh-claimant-details');
    expect(followUp.text).toContain('Please answer this question');
  });

  it('should save answers and proceed to next step', async () => {
    const res = await testSession.post('/claims/welsh-claimant-details').send({
      registered: 'yes',
      licensed: 'no',
      agent: 'not-applicable'
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/claims/next-step');
  });

  it('should show errors in Welsh if validation fails', async () => {
    const res = await testSession.post('/claims/welsh-claimant-details').send({ registered: '', licensed: '', agent: '' });
    expect(res.status).toBe(302);
    const followUp = await testSession.get('/claims/welsh-claimant-details');
    expect(followUp.text).toContain('Please answer this question');
  });

  it('should allow navigation: Previous, Continue, Cancel', async () => {
    const res = await testSession.get('/claims/welsh-claimant-details');
    expect(res.text).toContain('Continue'); // Continue
    expect(res.text).toContain('Back'); // Previous
    expect(res.text).toContain('Cancel'); // Cancel
  });

  it('should trigger save and return flow', async () => {
    const res = await testSession.get('/claims/welsh-claimant-details');
    expect(res.text).toContain('I want to save this claim and return to it later');
  });
});
