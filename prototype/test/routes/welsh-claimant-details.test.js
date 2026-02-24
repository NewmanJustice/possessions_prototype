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
    expect(res.text).toContain('A ydych wedi’ch cofrestru o dan Ran 1 o Ddeddf Tai (Cymru) 2014?');
    expect(res.text).toContain('A ydych wedi’ch trwyddedu o dan Ran 1 o Ddeddf Tai (Cymru) 2014?');
    expect(res.text).toContain('A ydych wedi penodi asiant trwyddedig ar gyfer rheoli’r eiddo?');
  });

  it('should require all questions to be answered', async () => {
    const res = await testSession.post('/claims/welsh-claimant-details').send({});
    expect(res.status).toBe(302);
    const followUp = await testSession.get('/claims/welsh-claimant-details');
    expect(followUp.text).toContain('Rhowch ateb i’r cwestiwn hwn');
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
    expect(followUp.text).toContain('Rhowch ateb i’r cwestiwn hwn');
  });

  it('should allow navigation: Previous, Continue, Cancel', async () => {
    const res = await testSession.get('/claims/welsh-claimant-details');
    expect(res.text).toContain('Bwrw ymlaen'); // Continue
    expect(res.text).toContain('Yn ôl'); // Previous
    expect(res.text).toContain('Canslo'); // Cancel
  });

  it('should trigger save and return flow', async () => {
    const res = await testSession.get('/claims/welsh-claimant-details');
    expect(res.text).toContain('Rwyf eisiau cadw’r cais hwn a dychwelyd ato yn nes ymlaen');
  });
});
